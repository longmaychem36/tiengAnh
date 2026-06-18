require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');
const grammarService = require('../src/modules/grammar/grammar.service');

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const topicResult = await pool.query(`
      SELECT
        gt.Id,
        gt.Title,
        gt.TitleVI,
        gc.Name AS category
      FROM GrammarTopics gt
      LEFT JOIN GrammarCategories gc ON gc.Id = gt.CategoryId
      ORDER BY gc.OrderIndex ASC, gt.OrderIndex ASC
    `);

    const failures = [];
    const summaries = [];
    for (const topic of topicResult.rows) {
      try {
        const detail = await grammarService.getTopicDetail(topic.id, null);
        summaries.push({
          id: topic.id,
          category: topic.category,
          title: topic.title,
          hasContent: Boolean(detail?.content || detail?.Content),
          quizCount: Array.isArray(detail?.quizzes) ? detail.quizzes.length : 0
        });
      } catch (error) {
        failures.push({
          id: topic.id,
          category: topic.category,
          title: topic.title,
          message: error.message
        });
      }
    }

    console.log(JSON.stringify({
      checked: topicResult.rows.length,
      failures,
      summaries
    }, null, 2));
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
