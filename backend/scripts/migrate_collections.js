require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function runMigration() {
  try {
    await connectDB();
    const pool = getPool();
    console.log('Connected. Running PostgreSQL collections migration...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserCollections (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        UserId uuid NOT NULL REFERENCES Users(Id),
        Name varchar(255) NOT NULL,
        Description text,
        CreatedAt timestamptz DEFAULT now()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserCollectionWords (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        CollectionId uuid NOT NULL REFERENCES UserCollections(Id) ON DELETE CASCADE,
        DictionaryEntryId uuid REFERENCES DictionaryEntries(Id) ON DELETE SET NULL,
        CustomWord varchar(255),
        CustomMeaning text,
        CustomExample text,
        AddedAt timestamptz DEFAULT now()
      )
    `);

    await pool.query(`
      ALTER TABLE UserCollections
      ADD COLUMN IF NOT EXISTS IsPublic boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS ReviewStatus varchar(20) NOT NULL DEFAULT 'approved',
      ADD COLUMN IF NOT EXISTS SubmittedAt timestamptz NULL,
      ADD COLUMN IF NOT EXISTS ReviewedAt timestamptz NULL,
      ADD COLUMN IF NOT EXISTS ReviewedBy uuid NULL REFERENCES Users(Id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS UpdatedAt timestamptz NOT NULL DEFAULT now()
    `);

    await pool.query(`
      ALTER TABLE UserCollectionWords
      ADD COLUMN IF NOT EXISTS UpdatedAt timestamptz NOT NULL DEFAULT now()
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_collections_public_review
      ON UserCollections (IsPublic, ReviewStatus, UpdatedAt DESC)
    `);

    console.log('Migration successful.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

runMigration();
