require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');
const grammarService = require('../src/modules/grammar/grammar.service');

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const userResult = await pool.query("SELECT Id FROM Users WHERE Role = 'user' LIMIT 1");
    const userId = userResult.rows[0]?.id || null;
    const categories = await grammarService.getCategories();
    const firstCategory = categories[0] || null;
    const categoryId = firstCategory?.Id ?? firstCategory?.id;
    const topics = categoryId ? await grammarService.getTopicsByCategory(categoryId, userId) : [];
    const firstTopic = topics[0] || null;
    const topicId = firstTopic?.Id ?? firstTopic?.id;
    const detail = topicId ? await grammarService.getTopicDetail(topicId, userId) : null;
    const firstQuiz = detail?.quizzes?.[0] || null;

    console.log(JSON.stringify({
      categoryCount: categories.length,
      firstCategory,
      categoryKeys: Object.keys(firstCategory || {}),
      topicCount: topics.length,
      firstTopic,
      topicKeys: Object.keys(firstTopic || {}),
      detailKeys: Object.keys(detail || {}),
      quizCount: detail?.quizzes?.length || 0,
      firstQuiz,
      quizKeys: Object.keys(firstQuiz || {})
    }, null, 2));
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
