// Cleanup duplicate MiniGameQuestions
// Usage:
//   node cleanup_minigame_duplicates.js        # dry-run (preview duplicates)
//   node cleanup_minigame_duplicates.js --apply # create backup and delete duplicates

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool } = require('../src/config/database');

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    apply: args.includes('--apply'),
    limitPreview: (() => {
      const i = args.indexOf('--limit');
      if (i !== -1 && args[i + 1]) return parseInt(args[i + 1], 10) || 20;
      return 20;
    })(),
  };
}

async function main() {
  const opts = parseArgs();
  await connectDB();
  const pool = getPool();

  // CTE: detect duplicates by LevelId + lower(ContentEN)
  const previewQuery = `WITH dup AS (
    SELECT Id, LevelId, ContentEN, ROW_NUMBER() OVER (
      PARTITION BY LevelId, LOWER(COALESCE(ContentEN,'')) ORDER BY Id
    ) AS rn
    FROM "MiniGameQuestions"
  )
  SELECT mq.* FROM "MiniGameQuestions" mq
  WHERE mq.Id IN (SELECT Id FROM dup WHERE rn > 1)
  ORDER BY mq."LevelId", mq."ContentEN"`;

  try {
    console.log(opts.apply ? 'Running in APPLY mode (will backup + delete duplicates)'
                           : 'Dry-run: listing duplicate rows (no changes)');

    const preview = await pool.request().query(previewQuery);
    const duplicates = preview.recordset || [];
    console.log(`Found ${duplicates.length} duplicate row(s) (LevelId + ContentEN ignoring case).`);

    if (duplicates.length > 0) {
      const sample = duplicates.slice(0, opts.limitPreview);
      console.table(sample.map(r => ({ Id: r.Id, LevelId: r.LevelId, ContentEN: r.ContentEN, ContentVI: r.ContentVI, CorrectAnswer: r.CorrectAnswer, OrderIndex: r.OrderIndex })));
    }

    if (!opts.apply) {
      console.log('\nPreview complete. To remove duplicates create a backup and delete, rerun with --apply');
      process.exit(0);
    }

    // Apply: create backup table then delete duplicates
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `MiniGameQuestions_backup_${ts}`;

    console.log(`Creating backup table "${backupName}"...`);
    await pool.request().query(`CREATE TABLE "${backupName}" AS TABLE "MiniGameQuestions"`);
    console.log('Backup created.');

    const deleteQuery = `WITH dup AS (
      SELECT Id, ROW_NUMBER() OVER (
        PARTITION BY LevelId, LOWER(COALESCE(ContentEN,'')) ORDER BY Id
      ) AS rn
      FROM "MiniGameQuestions"
    )
    DELETE FROM "MiniGameQuestions"
    WHERE Id IN (SELECT Id FROM dup WHERE rn > 1)`;

    const delRes = await pool.request().query(deleteQuery);
    const deleted = Array.isArray(delRes.rowsAffected) ? delRes.rowsAffected[0] : 0;
    console.log(`Deleted ${deleted} duplicate row(s).`);

    console.log('Done. Verify data integrity and remove backup when satisfied.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
