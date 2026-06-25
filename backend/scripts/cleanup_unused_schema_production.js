const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const statements = [
  `DROP TABLE IF EXISTS QuizOptions CASCADE`,
  `DROP TABLE IF EXISTS Quiz CASCADE`,
  `DROP TABLE IF EXISTS UserVocabulary CASCADE`,
  `DROP TABLE IF EXISTS LessonVocabulary CASCADE`,
  `DROP TABLE IF EXISTS LessonMedia CASCADE`,
  `DROP TABLE IF EXISTS UserProgress CASCADE`,
  `DROP TABLE IF EXISTS Vocabulary CASCADE`,
  `DROP TABLE IF EXISTS Lessons CASCADE`,
  `DROP TABLE IF EXISTS Courses CASCADE`,
  `ALTER TABLE IF EXISTS UserCollectionWords DROP COLUMN IF EXISTS DictionaryEntryId`,
  `DROP TABLE IF EXISTS DictionarySearchHistory CASCADE`,
  `DROP TABLE IF EXISTS DictionarySynonyms CASCADE`,
  `DROP TABLE IF EXISTS DictionaryEntries CASCADE`,
  `DROP TABLE IF EXISTS PlacementAttemptAnswers CASCADE`,
  `DROP TABLE IF EXISTS PlacementAttempts CASCADE`,
  `DROP TABLE IF EXISTS PlacementTestQuestions CASCADE`,
  `DROP TABLE IF EXISTS PlacementTests CASCADE`,
  `DROP TABLE IF EXISTS UserErrorEvents CASCADE`,
  `DROP TABLE IF EXISTS UserWeaknesses CASCADE`,
  `DROP TABLE IF EXISTS UserAchievements CASCADE`,
  `DROP TABLE IF EXISTS Achievements CASCADE`,
  `DROP TABLE IF EXISTS GameSets CASCADE`,
  `ALTER TABLE IF EXISTS GameLevels DROP COLUMN IF EXISTS SetId CASCADE`
];

async function main() {
  await pool.query('BEGIN');
  try {
    for (const sql of statements) {
      await pool.query(sql);
      console.log(sql);
    }
    await pool.query('COMMIT');
    console.log('cleanup committed');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

main()
  .catch((err) => {
    console.error('cleanup failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });