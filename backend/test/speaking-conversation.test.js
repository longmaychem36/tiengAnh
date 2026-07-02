const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const speakingService = require('../src/modules/speaking/speaking.service');

const {
  MIN_CONVERSATION_TURNS,
  MAX_CONVERSATION_TURNS,
  SHORT_CONVERSATION_TURNS,
  LONG_CONVERSATION_TURNS,
  normalizeTargetTurns,
  normalizeAiTurn,
  buildSystemPrompt,
  hashHistory,
  hashOption,
  signConversationToken,
  verifyConversationToken
} = speakingService._internals;

const assistantMessage = {
  id: 'ai-opening',
  role: 'assistant',
  text: 'Hello, what would you like to order?',
  translation: ''
};

const options = [
  { id: 'tea', text: 'I would like a cup of tea, please.' },
  { id: 'coffee', text: 'Could I have a black coffee, please?' },
  { id: 'menu', text: 'May I see the menu first, please?' }
];

const continuingRawTurn = {
  message: 'Would you like anything else with that?',
  options,
  isComplete: false,
  summary: ''
};

test('normalizes a continuing AI turn without requiring translations', () => {
  const turn = normalizeAiTurn(continuingRawTurn, { canComplete: false });
  assert.equal(turn.isComplete, false);
  assert.equal(turn.translation, '');
  assert.equal(turn.options.length, 3);
  assert.deepEqual(turn.options.map((option) => option.translation), ['', '', '']);
});

test('accepts common AI field aliases when normalizing a turn', () => {
  const turn = normalizeAiTurn({
    reply: 'You can use your credit card here.',
    choices: [
      { message: 'Great, I will pay by card.' },
      { message: 'How much do I need to pay?' },
      { message: 'Can I split the payment?' }
    ],
    isComplete: false
  }, { canComplete: false });

  assert.equal(turn.message, 'You can use your credit card here.');
  assert.equal(turn.translation, '');
  assert.equal(turn.options.length, 3);
});

test('keeps optional legacy Vietnamese translations when they are present', () => {
  const turn = normalizeAiTurn({
    message: 'You can use your credit card here.',
    translation: 'Bạn có thể dùng thẻ tín dụng ở đây.',
    options,
    isComplete: false
  }, { canComplete: false });

  assert.equal(turn.translation, 'Bạn có thể dùng thẻ tín dụng ở đây.');
});

test('rejects placeholder AI content instead of surfacing it to the learner', () => {
  assert.throws(
    () => normalizeAiTurn({
      message: 'English AI reply',
      options,
      isComplete: false
    }, { canComplete: false }),
    (error) => error.statusCode === 502
  );
});

test('beginner prompt asks for very easy English and no translations', () => {
  const prompt = buildSystemPrompt({
    topic: 'Shopping',
    level: 'beginner',
    targetTurns: 5,
    canComplete: false,
    forceComplete: false
  });
  assert.match(prompt, /absolute beginner/i);
  assert.match(prompt, /very easy everyday English/i);
  assert.match(prompt, /3 to 7 words/i);
  assert.match(prompt, /Target length: 5 learner replies/i);
  assert.match(prompt, /Do not include Vietnamese translations/i);
});

test('normalizes conversation length to short or long only', () => {
  assert.equal(normalizeTargetTurns(5), SHORT_CONVERSATION_TURNS);
  assert.equal(normalizeTargetTurns('short'), SHORT_CONVERSATION_TURNS);
  assert.equal(normalizeTargetTurns(10), LONG_CONVERSATION_TURNS);
  assert.equal(normalizeTargetTurns('long'), LONG_CONVERSATION_TURNS);
  assert.equal(normalizeTargetTurns(99), SHORT_CONVERSATION_TURNS);
});

test('ignores an early AI completion before the minimum turn', () => {
  const turn = normalizeAiTurn({ ...continuingRawTurn, isComplete: true }, { canComplete: false });
  assert.equal(turn.isComplete, false);
  assert.equal(MIN_CONVERSATION_TURNS, 5);
});

test('allows a natural completion after the minimum and forces it at the cap', () => {
  const natural = normalizeAiTurn({
    message: 'Thank you for visiting. Have a wonderful day!',
    options,
    isComplete: true,
    summary: ''
  }, { canComplete: true });
  assert.equal(natural.isComplete, true);
  assert.deepEqual(natural.options, []);

  const forced = normalizeAiTurn({ ...continuingRawTurn, isComplete: false }, { forceComplete: true });
  assert.equal(forced.isComplete, true);
  assert.deepEqual(forced.options, []);
  assert.equal(MAX_CONVERSATION_TURNS, 10);
});

test('history and option hashes change when browser data is modified', () => {
  const originalHistoryHash = hashHistory([assistantMessage]);
  const changedHistoryHash = hashHistory([{ ...assistantMessage, text: 'Changed message' }]);
  assert.notEqual(originalHistoryHash, changedHistoryHash);
  assert.notEqual(hashOption(options[0]), hashOption({ ...options[0], text: 'Changed reply' }));
});

test('conversation tokens reject another user, tampering, and expiry', () => {
  const payload = { tokenType: 'state', userId: 'user-1', sessionId: 'session-1' };
  const token = signConversationToken(payload);
  assert.equal(verifyConversationToken(token, 'state', 'user-1', 'session-1').userId, 'user-1');
  assert.throws(
    () => verifyConversationToken(token, 'state', 'user-2', 'session-1'),
    (error) => error.statusCode === 403
  );
  assert.throws(
    () => verifyConversationToken(`${token.slice(0, -1)}x`, 'state', 'user-1', 'session-1'),
    (error) => error.statusCode === 410
  );

  const expired = signConversationToken(payload, -1);
  assert.throws(
    () => verifyConversationToken(expired, 'state', 'user-1', 'session-1'),
    (error) => error.statusCode === 410
  );
});

test('a failed pronunciation keeps the current state and a passing one creates an advance token', () => {
  const userId = 'user-1';
  const sessionId = 'session-1';
  const history = [assistantMessage];
  const stateToken = signConversationToken({
    tokenType: 'state',
    userId,
    sessionId,
    topic: 'At a coffee shop',
    level: 'beginner',
    turnCount: 0,
    scoreTotal: 0,
    historyHash: hashHistory(history),
    currentTurnId: assistantMessage.id,
    optionHashes: options.map((option) => ({ id: option.id, hash: hashOption(option) })),
    status: 'ready'
  });

  const request = {
    stateToken,
    history,
    option: options[0],
    passThreshold: 60
  };
  const failed = speakingService.analyzeConversationTurn(userId, sessionId, request, {
    score: 45,
    transcript: 'I like tea',
    feedback: 'Try again.'
  });
  assert.equal(failed.passed, false);
  assert.equal(failed.stateToken, stateToken);
  assert.equal(failed.advanceToken, undefined);

  const passed = speakingService.analyzeConversationTurn(userId, sessionId, request, {
    score: 88,
    transcript: options[0].text,
    feedback: 'Good job.'
  });
  assert.equal(passed.passed, true);
  assert.equal(passed.learnerMessage.text, options[0].text);
  assert.ok(passed.advanceToken);
  const advance = verifyConversationToken(passed.advanceToken, 'advance', userId, sessionId);
  assert.equal(advance.turnCount, 1);
  assert.equal(advance.scoreTotal, 88);
});

test('the final learner reply completes the conversation without creating an AI advance token', () => {
  const userId = 'user-1';
  const sessionId = 'session-complete-after-learner';
  const history = [assistantMessage];
  const stateToken = signConversationToken({
    tokenType: 'state',
    userId,
    sessionId,
    topic: 'At a coffee shop',
    level: 'beginner',
    targetTurns: 5,
    turnCount: 4,
    scoreTotal: 360,
    historyHash: hashHistory(history),
    currentTurnId: assistantMessage.id,
    optionHashes: options.map((option) => ({ id: option.id, hash: hashOption(option) })),
    status: 'ready'
  });

  const result = speakingService.analyzeConversationTurn(userId, sessionId, {
    stateToken,
    history,
    option: options[0],
    passThreshold: 60
  }, {
    score: 90,
    transcript: options[0].text,
    feedback: 'Good job.'
  });

  assert.equal(result.passed, true);
  assert.equal(result.completed, true);
  assert.equal(result.advanceToken, undefined);
  assert.ok(result.stateToken);
  assert.equal(result.turnCount, 5);
  assert.equal(result.averageScore, 90);
});

test('rejects a reply that was not offered in the signed current turn', () => {
  const userId = 'user-1';
  const sessionId = 'session-1';
  const history = [assistantMessage];
  const stateToken = signConversationToken({
    tokenType: 'state', userId, sessionId, topic: 'Coffee', level: 'beginner',
    turnCount: 0, scoreTotal: 0, historyHash: hashHistory(history),
    optionHashes: [{ id: options[0].id, hash: hashOption(options[0]) }], status: 'ready'
  });
  assert.throws(
    () => speakingService.analyzeConversationTurn(userId, sessionId, {
      stateToken, history, option: options[1], passThreshold: 60
    }, { score: 90, transcript: options[1].text }),
    (error) => error.statusCode === 409
  );
});

test('retries an invalid opening and returns a signed browser-owned conversation', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const originalPost = axios.post;
  process.env.OPENAI_API_KEY = 'test-key';
  let calls = 0;
  axios.post = async (url, body, config) => {
    calls += 1;
    assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(body.model, 'gpt-4o-mini');
    assert.equal(config.headers.Authorization, 'Bearer test-key');
    const content = calls === 1
      ? JSON.stringify({ message: 'Welcome to the cafe.', options: [], isComplete: false })
      : JSON.stringify({
        message: 'Welcome to the cafe. What can I get for you?',
        options,
        isComplete: false,
        summary: ''
      });
    return { data: { choices: [{ message: { content } }] } };
  };

  try {
    const conversation = await speakingService.createPersonalizedLesson('user-1', {
      topic: 'At a coffee shop',
      level: 'beginner',
      targetTurns: 10
    });
    assert.equal(calls, 2);
    assert.equal(conversation.messages.length, 1);
    assert.equal(conversation.targetTurns, 10);
    assert.equal(conversation.currentTurn.options.length, 3);
    assert.ok(conversation.stateToken);
  } finally {
    axios.post = originalPost;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test('generates a final AI message from verified history at the short target', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const originalPost = axios.post;
  process.env.OPENAI_API_KEY = 'test-key';
  axios.post = async () => ({
    data: {
      choices: [{
        message: {
          content: JSON.stringify({
            message: 'Your order is ready. Thank you and have a great day!',
            options: [],
            isComplete: true,
            summary: ''
          })
        }
      }]
    }
  });

  const learnerMessage = {
    id: 'learner-four',
    role: 'learner',
    text: options[0].text,
    translation: '',
    transcript: options[0].text,
    score: 90,
    feedback: 'Good job.',
    missingWords: [],
    extraWords: []
  };
  const history = [assistantMessage, learnerMessage];
  const advanceToken = signConversationToken({
    tokenType: 'advance', userId: 'user-1', sessionId: 'session-final',
    topic: 'At a coffee shop', level: 'beginner', targetTurns: 5, turnCount: 5,
    scoreTotal: 440, historyHash: hashHistory(history), status: 'awaiting_ai'
  });

  try {
    const result = await speakingService.generateNextConversationTurn('user-1', 'session-final', {
      advanceToken,
      history
    });
    assert.equal(result.completed, true);
    assert.equal(result.assistantMessage, null);
    assert.equal(result.currentTurn, null);
    assert.equal(result.averageScore, 88);
    assert.ok(result.summary);
  } finally {
    axios.post = originalPost;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});
