const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const speakingService = require('../src/modules/speaking/speaking.service');

const {
  MIN_CONVERSATION_TURNS,
  MAX_CONVERSATION_TURNS,
  normalizeAiTurn,
  hashHistory,
  hashOption,
  signConversationToken,
  verifyConversationToken
} = speakingService._internals;

const assistantMessage = {
  id: 'ai-opening',
  role: 'assistant',
  text: 'Hello, what would you like to order?',
  translation: 'Xin chào, bạn muốn gọi món gì?'
};

const options = [
  { id: 'tea', text: 'I would like a cup of tea, please.', translation: 'Tôi muốn một tách trà.' },
  { id: 'coffee', text: 'Could I have a black coffee, please?', translation: 'Cho tôi một cà phê đen.' },
  { id: 'menu', text: 'May I see the menu first, please?', translation: 'Cho tôi xem thực đơn trước.' }
];

const continuingRawTurn = {
  message: 'Would you like anything else with that?',
  translation: 'Bạn có muốn dùng thêm gì không?',
  options,
  isComplete: false,
  summary: ''
};

test('normalizes a continuing AI turn with exactly three replies', () => {
  const turn = normalizeAiTurn(continuingRawTurn, { canComplete: false });
  assert.equal(turn.isComplete, false);
  assert.equal(turn.options.length, 3);
});

test('accepts common AI field aliases when normalizing a turn', () => {
  const turn = normalizeAiTurn({
    reply: 'You can use your credit card here.',
    vi: 'Báº¡n cÃ³ thá»ƒ dÃ¹ng tháº» tÃ­n dá»¥ng á»Ÿ Ä‘Ã¢y.',
    choices: [
      { message: 'Great, I will pay by card.', vi: 'Tuyá»‡t, tÃ´i sáº½ thanh toÃ¡n báº±ng tháº».' },
      { message: 'How much do I need to pay?', vi: 'TÃ´i cáº§n tráº£ bao nhiÃªu?' },
      { message: 'Can I split the payment?', vi: 'TÃ´i cÃ³ thá»ƒ chia hÃ³a Ä‘Æ¡n khÃ´ng?' }
    ],
    isComplete: false
  }, { canComplete: false });

  assert.equal(turn.message, 'You can use your credit card here.');
  assert.equal(turn.translation, 'Báº¡n cÃ³ thá»ƒ dÃ¹ng tháº» tÃ­n dá»¥ng á»Ÿ Ä‘Ã¢y.');
  assert.equal(turn.options.length, 3);
});

test('rejects placeholder AI content instead of surfacing it to the learner', () => {
  assert.throws(
    () => normalizeAiTurn({
      message: 'English AI reply',
      translation: 'Báº£n dá»‹ch tiáº¿ng Viá»‡t há»£p lá»‡.',
      options,
      isComplete: false
    }, { canComplete: false }),
    (error) => error.statusCode === 502
  );
});

test('ignores an early AI completion before the minimum turn', () => {
  const turn = normalizeAiTurn({ ...continuingRawTurn, isComplete: true }, { canComplete: false });
  assert.equal(turn.isComplete, false);
  assert.equal(MIN_CONVERSATION_TURNS, 4);
});

test('allows a natural completion after the minimum and forces it at the cap', () => {
  const natural = normalizeAiTurn({
    message: 'Thank you for visiting. Have a wonderful day!',
    translation: 'Cảm ơn bạn đã ghé thăm. Chúc bạn một ngày tốt lành!',
    options,
    isComplete: true,
    summary: 'Bạn đã hoàn thành tình huống gọi món.'
  }, { canComplete: true });
  assert.equal(natural.isComplete, true);
  assert.deepEqual(natural.options, []);

  const forced = normalizeAiTurn({ ...continuingRawTurn, isComplete: false }, { forceComplete: true });
  assert.equal(forced.isComplete, true);
  assert.deepEqual(forced.options, []);
  assert.equal(MAX_CONVERSATION_TURNS, 12);
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
  const previousKey = process.env.NVIDIA_API_KEY;
  const originalPost = axios.post;
  process.env.NVIDIA_API_KEY = 'test-key';
  let calls = 0;
  axios.post = async () => {
    calls += 1;
    const content = calls === 1
      ? JSON.stringify({ message: 'Welcome to the cafe.', translation: '', options, isComplete: false })
      : JSON.stringify({
        message: 'Welcome to the cafe. What can I get for you?',
        translation: 'Chào mừng đến quán cà phê. Tôi có thể lấy gì cho bạn?',
        options,
        isComplete: false,
        summary: ''
      });
    return { data: { choices: [{ message: { content } }] } };
  };

  try {
    const conversation = await speakingService.createPersonalizedLesson('user-1', {
      topic: 'At a coffee shop',
      level: 'beginner'
    });
    assert.equal(calls, 2);
    assert.equal(conversation.messages.length, 1);
    assert.equal(conversation.currentTurn.options.length, 3);
    assert.ok(conversation.stateToken);
  } finally {
    axios.post = originalPost;
    if (previousKey === undefined) delete process.env.NVIDIA_API_KEY;
    else process.env.NVIDIA_API_KEY = previousKey;
  }
});

test('generates a natural final AI message from verified history after turn four', async () => {
  const previousKey = process.env.NVIDIA_API_KEY;
  const originalPost = axios.post;
  process.env.NVIDIA_API_KEY = 'test-key';
  axios.post = async () => ({
    data: {
      choices: [{
        message: {
          content: JSON.stringify({
            message: 'Your order is ready. Thank you and have a great day!',
            translation: 'Đơn của bạn đã sẵn sàng. Cảm ơn và chúc bạn một ngày tốt lành!',
            options: [],
            isComplete: true,
            summary: 'Bạn đã hoàn thành tình huống gọi món tại quán cà phê.'
          })
        }
      }]
    }
  });

  const learnerMessage = {
    id: 'learner-four',
    role: 'learner',
    text: options[0].text,
    translation: options[0].translation,
    transcript: options[0].text,
    score: 90,
    feedback: 'Good job.',
    missingWords: [],
    extraWords: []
  };
  const history = [assistantMessage, learnerMessage];
  const advanceToken = signConversationToken({
    tokenType: 'advance', userId: 'user-1', sessionId: 'session-final',
    topic: 'At a coffee shop', level: 'beginner', turnCount: 4,
    scoreTotal: 350, historyHash: hashHistory(history), status: 'awaiting_ai'
  });

  try {
    const result = await speakingService.generateNextConversationTurn('user-1', 'session-final', {
      advanceToken,
      history
    });
    assert.equal(result.completed, true);
    assert.equal(result.currentTurn, null);
    assert.equal(result.averageScore, 88);
    assert.match(result.summary, /gọi món/);
  } finally {
    axios.post = originalPost;
    if (previousKey === undefined) delete process.env.NVIDIA_API_KEY;
    else process.env.NVIDIA_API_KEY = previousKey;
  }
});
