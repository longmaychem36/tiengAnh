const { connectDB, getPool } = require('../src/config/database');

async function checkAndFix() {
  await connectDB();
  const pool = getPool();
  
  // Check existing constraints on SpeakingProgress
  const constraints = await pool.query(`
    SELECT constraint_name, constraint_type
    FROM information_schema.table_constraints
    WHERE table_name = 'speakingprogress'
  `);
  console.log('Constraints:', constraints.rows);

  // Check columns
  const cols = await pool.query(`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'speakingprogress'
    ORDER BY ordinal_position
  `);
  console.log('Columns:', cols.rows);

  // Check if unique constraint exists on (UserId, LessonId)
  const hasUnique = constraints.rows.some(r =>
    r.constraint_type === 'UNIQUE' || r.constraint_name?.toLowerCase().includes('userid') || r.constraint_name?.toLowerCase().includes('lesson')
  );

  if (!hasUnique) {
    console.log('No unique constraint found — adding...');
    try {
      await pool.query(`
        ALTER TABLE SpeakingProgress
        ADD CONSTRAINT uq_speakingprogress_user_lesson UNIQUE (UserId, LessonId)
      `);
      console.log('✅ Unique constraint added!');
    } catch(e) {
      if (e.message.includes('already exists')) {
        console.log('✅ Constraint already exists');
      } else {
        console.log('Error adding constraint:', e.message);
      }
    }
  } else {
    console.log('✅ Unique constraint already exists');
  }

  process.exit(0);
}

checkAndFix().catch(e => { console.error(e); process.exit(1); });
