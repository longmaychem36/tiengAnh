require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB, sql } = require('../src/config/database');
const { enhanceGrammarContent, insertExtraGrammarQuizzes } = require('./grammar_enhancement_data');

async function insertQuiz(topicId, q, a, b, c, d, ans, explain) {
  const pool = getPool();
  await pool.request()
    .input('tid', sql.UniqueIdentifier, topicId)
    .input('q', sql.NVarChar, q)
    .input('a', sql.NVarChar, a)
    .input('b', sql.NVarChar, b)
    .input('c', sql.NVarChar, c)
    .input('d', sql.NVarChar, d)
    .input('ans', sql.NVarChar, ans)
    .input('ex', sql.NVarChar, explain)
    .query(`
      INSERT INTO GrammarQuiz (TopicId, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation)
      VALUES (@tid, @q, @a, @b, @c, @d, @ans, @ex)
    `);
}

async function ensureGrammarProgressTable(pool) {
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
}

async function enhanceExistingGrammar() {
  try {
    await connectDB();
    const pool = getPool();
    await ensureGrammarProgressTable(pool);

    const topicResult = await pool.request().query('SELECT Id, Title, Content FROM GrammarTopics');
    let updatedContent = 0;

    for (const topic of topicResult.recordset) {
      const nextContent = enhanceGrammarContent(topic.Title, topic.Content || '');
      if (nextContent !== (topic.Content || '')) {
        await pool.request()
          .input('topicId', sql.UniqueIdentifier, topic.Id)
          .input('content', sql.NVarChar, nextContent)
          .query('UPDATE GrammarTopics SET Content = @content WHERE Id = @topicId');
        updatedContent += 1;
      }
    }

    await insertExtraGrammarQuizzes(pool, insertQuiz);
    console.log(`Grammar enhanced. Updated theory: ${updatedContent} topic(s). Quiz coverage checked.`);
  } catch (err) {
    console.error('Enhance grammar failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

enhanceExistingGrammar();
