const { getPool } = require('../../config/database');
const { ensureOnboardingSchema, getUserPlacementLevel } = require('../onboarding/onboarding.schema');
const { ensureSoftDeleteSchema } = require('../soft-delete/soft-delete.schema');

const SKILL_CONFIG = {
  listening: {
    lessonTable: 'ListeningLessons',
    contentTable: 'ListeningSegments',
    speakerTable: 'ListeningSpeakers',
    vocabTable: 'ListeningVocabulary',
    questionTable: 'ListeningQuestions',
    progressTable: 'ListeningProgress',
    contentSelect: 's.Id, s.SpeakerId, COALESCE(sp.Name, s.Speaker) AS Speaker, sp.Gender, sp.VoiceName, sp.VoiceURI, s.Text, s.OrderIndex',
    contentOrder: 'OrderIndex ASC'
  },
  reading: {
    lessonTable: 'ReadingLessons',
    contentTable: 'ReadingParagraphs',
    vocabTable: 'ReadingVocabulary',
    questionTable: 'ReadingQuestions',
    progressTable: 'ReadingProgress',
    contentSelect: 'Id, Content, OrderIndex',
    contentOrder: 'OrderIndex ASC'
  }
};

function getConfig(skill) {
  const config = SKILL_CONFIG[skill];
  if (!config) throw new Error(`Unsupported receptive skill: ${skill}`);
  return config;
}

function splitAcceptedAnswers(value, correctAnswer) {
  const items = String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (correctAnswer && !items.some((item) => item.toLowerCase() === String(correctAnswer).toLowerCase())) {
    items.unshift(correctAnswer);
  }

  return items;
}

function mapQuestion(row) {
  const type = row.questiontype || row.QuestionType || 'multiple_choice';
  const options = [row.optiona, row.optionb, row.optionc, row.optiond]
    .filter(Boolean);
  const correctAnswer = row.correctanswer ?? row.CorrectAnswer ?? '';

  return {
    id: row.id || row.Id,
    type,
    prompt: row.prompt || row.Prompt,
    options,
    answer: type === 'true_false' ? Boolean(row.correctboolean ?? row.CorrectBoolean) : correctAnswer,
    acceptedAnswers: type === 'fill_blank' ? splitAcceptedAnswers(row.acceptedanswers || row.AcceptedAnswers, correctAnswer) : undefined,
    explanation: row.explanation || row.Explanation || ''
  };
}

const receptiveService = {
  async getLessons(skill, userId) {
    const config = getConfig(skill);
    const pool = getPool();
    await ensureOnboardingSchema();
    await ensureSoftDeleteSchema();
    const placementLevel = await getUserPlacementLevel(userId);

    const result = await pool.query(`
      SELECT l.*, COUNT(q.Id) AS question_count
      FROM ${config.lessonTable} l
      LEFT JOIN ${config.questionTable} q ON q.LessonId = l.Id
      WHERE COALESCE(l.IsDeleted, false) = false
      GROUP BY l.Id
      ORDER BY l.OrderIndex ASC, l.CreatedAt ASC
    `);

    const progressResult = await pool.query(`
      SELECT LessonId, Status, Score
      FROM ${config.progressTable}
      WHERE UserId = $1
    `, [userId]);
    const progressMap = new Map(progressResult.rows.map((row) => [String(row.lessonid), row]));
    const visibleRows = placementLevel === 'basic'
      ? result.rows.filter((row) => !row.isfoundation)
      : result.rows;

    return visibleRows.map((row, index) => {
      const progress = progressMap.get(String(row.id));
      const previousRow = visibleRows[index - 1];
      const previousProgress = previousRow ? progressMap.get(String(previousRow.id)) : null;

      return {
        id: row.id,
        title: row.title,
        description: row.description || '',
        level: row.level || 'A1',
        topic: row.topic || '',
        objective: row.objective || '',
        duration: row.duration || '',
        passageTitle: row.passagetitle || '',
        audioUrl: row.audiourl || '',
        orderIndex: row.orderindex || 0,
        isFoundation: Boolean(row.isfoundation),
        questionCount: Number(row.question_count || 0),
        isCompleted: progress?.status === 'completed',
        score: progress?.score || 0,
        isLocked: index > 0 && previousProgress?.status !== 'completed'
      };
    });
  },

  async getLessonDetails(skill, lessonId, userId) {
    const config = getConfig(skill);
    const pool = getPool();
    await ensureOnboardingSchema();
    await ensureSoftDeleteSchema();

    const lessonResult = await pool.query(`
      SELECT *
      FROM ${config.lessonTable}
      WHERE Id = $1 AND COALESCE(IsDeleted, false) = false
    `, [lessonId]);

    if (lessonResult.rows.length === 0) return null;
    const lessonRow = lessonResult.rows[0];
    if (userId && lessonRow.isfoundation && await getUserPlacementLevel(userId) === 'basic') {
      return null;
    }

    const contentQuery = skill === 'listening'
      ? `
        SELECT ${config.contentSelect}
        FROM ${config.contentTable} s
        LEFT JOIN ${config.speakerTable} sp ON sp.Id = s.SpeakerId
        WHERE s.LessonId = $1
        ORDER BY s.${config.contentOrder}
      `
      : `
        SELECT ${config.contentSelect}
        FROM ${config.contentTable}
        WHERE LessonId = $1
        ORDER BY ${config.contentOrder}
      `;

    const speakerQuery = skill === 'listening'
      ? pool.query(`
        SELECT Id, Name, Gender, VoiceName, VoiceURI, OrderIndex
        FROM ${config.speakerTable}
        WHERE LessonId = $1
        ORDER BY OrderIndex ASC, Name ASC
      `, [lessonId])
      : Promise.resolve({ rows: [] });

    const [contentResult, vocabResult, questionResult, speakerResult] = await Promise.all([
      pool.query(contentQuery, [lessonId]),
      pool.query(`
        SELECT Id, Word, Meaning, OrderIndex
        FROM ${config.vocabTable}
        WHERE LessonId = $1
        ORDER BY OrderIndex ASC, Word ASC
      `, [lessonId]),
      pool.query(`
        SELECT *
        FROM ${config.questionTable}
        WHERE LessonId = $1
        ORDER BY OrderIndex ASC
      `, [lessonId]),
      speakerQuery
    ]);

    const lesson = {
      id: lessonRow.id,
      title: lessonRow.title,
      description: lessonRow.description || '',
      level: lessonRow.level || 'A1',
      topic: lessonRow.topic || '',
      objective: lessonRow.objective || '',
      duration: lessonRow.duration || '',
      passageTitle: lessonRow.passagetitle || lessonRow.title,
      audioUrl: lessonRow.audiourl || '',
      isFoundation: Boolean(lessonRow.isfoundation),
      speakers: speakerResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        gender: row.gender || 'female',
        voiceName: row.voicename || '',
        voiceURI: row.voiceuri || ''
      })),
      vocabulary: vocabResult.rows.map((row) => ({
        id: row.id,
        word: row.word,
        meaning: row.meaning || ''
      })),
      questions: questionResult.rows.map(mapQuestion)
    };

    if (skill === 'listening') {
      lesson.transcript = contentResult.rows.map((row) => ({
        id: row.id,
        speakerId: row.speakerid || '',
        speaker: row.speaker || '',
        speakerProfile: {
          id: row.speakerid || '',
          name: row.speaker || '',
          gender: row.gender || 'female',
          voiceName: row.voicename || '',
          voiceURI: row.voiceuri || ''
        },
        text: row.text || ''
      }));
    } else {
      lesson.paragraphs = contentResult.rows.map((row) => row.content || '');
    }

    return lesson;
  },

  async saveProgress(skill, userId, lessonId, score, completed) {
    const config = getConfig(skill);
    const pool = getPool();
    const status = completed ? 'completed' : 'in_progress';

    await pool.query(`
      INSERT INTO ${config.progressTable} (UserId, LessonId, Status, Score, UpdatedAt)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (UserId, LessonId)
      DO UPDATE SET
        Status = CASE
          WHEN ${config.progressTable}.Status = 'completed' THEN 'completed'
          ELSE EXCLUDED.Status
        END,
        Score = GREATEST(COALESCE(${config.progressTable}.Score, 0), COALESCE(EXCLUDED.Score, 0)),
        UpdatedAt = NOW()
    `, [userId, lessonId, status, score]);
  }
};

module.exports = receptiveService;
