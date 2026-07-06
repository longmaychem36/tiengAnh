// ============================================
// Grammar Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const dailyService = require('../daily/daily.service');
const spacedRepetitionService = require('../spaced-repetition/spaced-repetition.service');
const { ensureSoftDeleteSchema } = require('../soft-delete/soft-delete.schema');

let progressTableReady = false;

async function ensureProgressTable(pool) {
  if (progressTableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS GrammarProgress (
      UserId uuid NOT NULL,
      TopicId uuid NOT NULL REFERENCES GrammarTopics(Id) ON DELETE CASCADE,
      BestScore integer DEFAULT 0,
      LastScore integer DEFAULT 0,
      Attempts integer DEFAULT 0,
      Status varchar(20) DEFAULT 'in_progress',
      UpdatedAt timestamp DEFAULT NOW(),
      PRIMARY KEY (UserId, TopicId)
    )
  `);
  progressTableReady = true;
}

function createLockedError(message) {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

function pickValue(row, ...keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return undefined;
}

function getNumber(row, fallback, ...keys) {
  const value = Number(pickValue(row, ...keys));
  return Number.isFinite(value) ? value : fallback;
}

const grammarService = {
  async getCategories() {
    await ensureSoftDeleteSchema();
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT gc.Id, gc.Name, gc.NameVI, gc.Icon, gc.OrderIndex,
             (SELECT COUNT(*) FROM GrammarTopics WHERE CategoryId = gc.Id AND COALESCE(IsDeleted, false) = false) as TopicCount
      FROM GrammarCategories gc
      ORDER BY gc.OrderIndex ASC
    `);
    return result.recordset;
  },

  async getTopicsByCategory(categoryId, userId = null) {
    const pool = getPool();
    await ensureProgressTable(pool);
    await ensureSoftDeleteSchema();

    const result = await pool.request()
      .input('categoryId', sql.Int, parseInt(categoryId))
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT gt.Id, gt.Title, gt.TitleVI, gt.OrderIndex, gc.Name as CategoryName, gc.NameVI as CategoryNameVI,
               (SELECT COUNT(*) FROM GrammarQuiz WHERE TopicId = gt.Id) as QuizCount,
               COALESCE(gp.BestScore, 0) as BestScore,
               COALESCE(gp.LastScore, 0) as LastScore,
               COALESCE(gp.Attempts, 0) as Attempts,
               COALESCE(gp.Status, 'not_started') as Status
        FROM GrammarTopics gt
        LEFT JOIN GrammarCategories gc ON gt.CategoryId = gc.Id
        LEFT JOIN GrammarProgress gp ON gp.TopicId = gt.Id AND gp.UserId = @userId
        WHERE gt.CategoryId = @categoryId
          AND COALESCE(gt.IsDeleted, false) = false
        ORDER BY gt.OrderIndex ASC
      `);
    const topics = result.recordset;
    return topics.map((topic, index) => {
      const previousTopic = index > 0 ? topics[index - 1] : null;
      const previousScore = getNumber(previousTopic, 0, 'BestScore', 'Bestscore', 'bestScore', 'bestscore', 'best_score');
      const isLocked = index > 0 && previousScore < 80;
      return {
        ...topic,
        RequiredScore: 80,
        IsLocked: isLocked,
        UnlockMessage: isLocked ? 'Hoàn thành chủ đề trước ít nhất 80% để mở khóa.' : ''
      };
    });
  },

  async getTopicDetail(topicId, userId = null) {
    const pool = getPool();
    await ensureProgressTable(pool);
    await ensureSoftDeleteSchema();
    
    const topicResult = await pool.request()
      .input('topicId', sql.UniqueIdentifier, topicId)
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT gt.Id, gt.Title, gt.TitleVI, gt.Content, gt.CategoryId, gt.OrderIndex,
               gc.Name as CategoryName, gc.NameVI as CategoryNameVI,
               COALESCE(gp.BestScore, 0) as BestScore,
               COALESCE(gp.LastScore, 0) as LastScore,
               COALESCE(gp.Attempts, 0) as Attempts
        FROM GrammarTopics gt
        LEFT JOIN GrammarCategories gc ON gt.CategoryId = gc.Id
        LEFT JOIN GrammarProgress gp ON gp.TopicId = gt.Id AND gp.UserId = @userId
        WHERE gt.Id = @topicId
          AND COALESCE(gt.IsDeleted, false) = false
      `);

    if (topicResult.recordset.length === 0) return null;
    const topic = topicResult.recordset[0];

    const topicOrderIndex = getNumber(topic, 0, 'OrderIndex', 'Orderindex', 'orderIndex', 'orderindex', 'order_index');
    if (userId && topicOrderIndex > 0) {
      const categoryId = pickValue(topic, 'CategoryId', 'Categoryid', 'categoryId', 'categoryid', 'category_id');
      const previousResult = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .input('orderIndex', sql.Int, topicOrderIndex)
        .input('userId', sql.UniqueIdentifier, userId)
        .query(`
          SELECT gt.Id, gt.Title, COALESCE(gp.BestScore, 0) as BestScore
          FROM GrammarTopics gt
          LEFT JOIN GrammarProgress gp ON gp.TopicId = gt.Id AND gp.UserId = @userId
          WHERE gt.CategoryId = @categoryId AND gt.OrderIndex < @orderIndex
            AND COALESCE(gt.IsDeleted, false) = false
          ORDER BY gt.OrderIndex DESC
          LIMIT 1
        `);
      const previousTopic = previousResult.recordset[0];
      if (previousTopic && getNumber(previousTopic, 0, 'BestScore', 'Bestscore', 'bestScore', 'bestscore', 'best_score') < 80) {
        throw createLockedError('Bạn cần hoàn thành chủ đề trước ít nhất 80% để mở khóa chủ đề này.');
      }
    }

    const quizResult = await pool.request()
      .input('topicId', sql.UniqueIdentifier, topicId)
      .query(`
        SELECT Id, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation
        FROM GrammarQuiz WHERE TopicId = @topicId
      `);
    topic.quizzes = quizResult.recordset;

    return topic;
  },

  async submitQuizAttempt(userId, topicId, answers = [], attemptId = null) {
    const pool = getPool();
    await ensureProgressTable(pool);
    await ensureSoftDeleteSchema();
    const quizResult = await pool.query(`
      SELECT q.Id, q.Question, q.CorrectAnswer, q.Explanation,
             gt.Title, gt.TitleVI, gt.CategoryId
      FROM GrammarQuiz q
      INNER JOIN GrammarTopics gt ON gt.Id = q.TopicId
      WHERE q.TopicId = $1
        AND COALESCE(gt.IsDeleted, false) = false
    `, [topicId]);

    const quizMap = new Map(quizResult.rows.map((row) => [String(row.id), row]));
    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      const quiz = quizMap.get(String(answer.quizId));
      if (!quiz) continue;

      const selectedAnswer = String(answer.answer || '').trim();
      const correctAnswer = String(quiz.correctanswer || '').trim();
      const correct = selectedAnswer === correctAnswer;
      if (correct) correctCount += 1;

      results.push({
        quizId: quiz.id,
        correct,
        selectedAnswer,
        correctAnswer,
        explanation: quiz.explanation
      });
    }

    const total = answers.length || quizResult.rows.length;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const status = score >= 80 ? 'completed' : 'in_progress';
    await pool.query(`
      INSERT INTO GrammarProgress (UserId, TopicId, BestScore, LastScore, Attempts, Status, UpdatedAt)
      VALUES ($1, $2, $3, $3, 1, $4, NOW())
      ON CONFLICT (UserId, TopicId)
      DO UPDATE SET
        BestScore = GREATEST(GrammarProgress.BestScore, EXCLUDED.BestScore),
        LastScore = EXCLUDED.LastScore,
        Attempts = GrammarProgress.Attempts + 1,
        Status = CASE
          WHEN GREATEST(GrammarProgress.BestScore, EXCLUDED.BestScore) >= 80 THEN 'completed'
          ELSE 'in_progress'
        END,
        UpdatedAt = NOW()
    `, [userId, topicId, score, status]);
    const spacedRepetition = await spacedRepetitionService.recordReview({
      userId,
      targetType: 'grammar_topic',
      targetId: topicId,
      score,
      attemptId
    });
    if (score >= 80) {
      await dailyService.completeMatchingTasks(userId, 'grammar_topic', topicId);
    }

    return {
      topicId,
      score,
      correctCount,
      total,
      results,
      nextReviewDate: spacedRepetitionService.formatDueDate(spacedRepetition.item.duedate || spacedRepetition.item.DueDate)
    };
  }
};

module.exports = grammarService;

