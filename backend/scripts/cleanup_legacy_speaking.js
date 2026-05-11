require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function run() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    const pool = getPool();

    console.log('Starting cleanup...');

    // 1. Drop legacy tables (if they exist)
    const tablesToDrop = [
      'SpeakingRecords',
      'UserGameSession',
      'GameOptions',
      'GameQuestions',
      'Games'
    ];

    for (const table of tablesToDrop) {
      try {
        console.log(`Dropping table ${table}...`);
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      } catch (err) {
        console.error(`Error dropping table ${table}:`, err.message);
      }
    }

    // 2. Remove 'speaking' game set from mini games
    console.log("Removing 'speaking' game set from GameSets...");
    // First find the ID to be sure
    const setRes = await pool.query("SELECT id FROM GameSets WHERE GameType = 'speaking'");
    if (setRes.rows.length > 0) {
      for (const row of setRes.rows) {
        const setId = row.id;
        console.log(`Deleting GameSet ${setId} (and its levels/questions via CASCADE)...`);
        
        // Note: GameLevels has FK to GameSets with ON DELETE NO ACTION by default usually, 
        // but let's check if we need to delete children manually or if CASCADE works.
        // In cosodulieu.sql, GameLevels and MiniGameQuestions don't have CASCADE on delete.
        
        const levelsRes = await pool.query(`SELECT id FROM GameLevels WHERE SetId = '${setId}'`);
        for (const level of levelsRes.rows) {
          await pool.query(`DELETE FROM MiniGameQuestions WHERE LevelId = '${level.id}'`);
        }
        await pool.query(`DELETE FROM GameLevels WHERE SetId = '${setId}'`);
        await pool.query(`DELETE FROM UserGameProgress WHERE LevelId IN (SELECT id FROM GameLevels WHERE SetId = '${setId}')`); // Just in case
        await pool.query(`DELETE FROM GameSets WHERE Id = '${setId}'`);
      }
      console.log("Legacy 'speaking' game set removed.");
    } else {
      console.log("No 'speaking' game set found.");
    }

    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await closeDB();
    process.exit(0);
  }
}

run();
