require('dotenv').config();
const { connectDB, closeDB } = require('../src/config/database');
const spacedRepetitionService = require('../src/modules/spaced-repetition/spaced-repetition.service');

async function run() {
  await connectDB();
  await spacedRepetitionService.ensureSchema();
  const summary = await spacedRepetitionService.backfillExistingProgress();
  console.log('Spaced repetition migration completed:', summary);
}

run()
  .catch((error) => {
    console.error('Spaced repetition migration failed:', error);
    process.exitCode = 1;
  })
  .finally(closeDB);
