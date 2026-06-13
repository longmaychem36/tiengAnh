require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { connectDB, closeDB } = require('../src/config/database');
const { ensureOnboardingSchema } = require('../src/modules/onboarding/onboarding.schema');

async function migrate() {
  try {
    await connectDB();
    await ensureOnboardingSchema();
    console.log('Onboarding migration completed.');
  } catch (err) {
    console.error('Onboarding migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
