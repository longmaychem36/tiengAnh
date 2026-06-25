const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const mockEmails = ['testuser_gemini@example.com', 'superadmin@system.com'];
const seededVocabularyDeckNames = [
  'Daily Conversations A1-A2',
  'Travel & Services A2-B1',
  'Work & Study B1',
  'IELTS Topic Vocabulary B1-B2'
];

async function deleteAndLog(label, sql, params = []) {
  const result = await pool.query(sql, params);
  console.log(`${label}: ${result.rowCount}`);
}

async function main() {
  await pool.query('BEGIN');
  try {
    const mockUsers = await pool.query(
      `SELECT Id FROM Users WHERE LOWER(Email) = ANY($1::text[])`,
      [mockEmails]
    );
    const mockUserIds = mockUsers.rows.map((row) => row.id);

    const seededCollections = await pool.query(
      `SELECT Id FROM UserCollections WHERE Name = ANY($1::text[])`,
      [seededVocabularyDeckNames]
    );
    const seededCollectionIds = seededCollections.rows.map((row) => row.id);

    await deleteAndLog(
      'seeded vocabulary words removed',
      `DELETE FROM UserCollectionWords WHERE CollectionId = ANY($1::uuid[])`,
      [seededCollectionIds]
    );
    await deleteAndLog(
      'seeded vocabulary collections removed',
      `DELETE FROM UserCollections WHERE Id = ANY($1::uuid[])`,
      [seededCollectionIds]
    );

    await deleteAndLog('daily tasks removed', `DELETE FROM DailyTasks`);
    await deleteAndLog('study time rows for mock users removed', `DELETE FROM StudyTimeDaily WHERE UserId = ANY($1::uuid[])`, [mockUserIds]);
    await deleteAndLog('game progress removed', `DELETE FROM UserGameProgress`);
    await deleteAndLog('mini game questions removed', `DELETE FROM MiniGameQuestions`);
    await deleteAndLog('game levels removed', `DELETE FROM GameLevels`);

    await deleteAndLog(
      'expired/used password reset codes removed',
      `DELETE FROM PasswordResetCodes WHERE ExpiresAt < NOW() OR UsedAt IS NOT NULL`
    );
    await deleteAndLog(
      'password reset codes for mock users removed',
      `DELETE FROM PasswordResetCodes WHERE UserId = ANY($1::uuid[])`,
      [mockUserIds]
    );

    await deleteAndLog('user stats for mock users removed', `DELETE FROM UserStats WHERE UserId = ANY($1::uuid[])`, [mockUserIds]);
    await deleteAndLog('mock users removed', `DELETE FROM Users WHERE Id = ANY($1::uuid[])`, [mockUserIds]);

    await pool.query('COMMIT');
    console.log('mock data cleanup committed');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

main()
  .catch((err) => {
    console.error('mock data cleanup failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });