require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, closeDB } = require('../src/config/database');
const dailyService = require('../src/modules/daily/daily.service');

async function migrate() {
  try {
    await connectDB();
    await dailyService.ensureInsightsSchema();
    console.log('Daily tasks and learning insights migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
