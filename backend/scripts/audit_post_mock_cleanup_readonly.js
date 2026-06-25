const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const queries = {
  users: `SELECT username,email,role FROM users ORDER BY createdat ASC`,
  counts: `
    SELECT 'dailytasks' AS table_name, COUNT(*)::int AS count FROM dailytasks
    UNION ALL SELECT 'studytimedaily', COUNT(*)::int FROM studytimedaily
    UNION ALL SELECT 'gamelevels', COUNT(*)::int FROM gamelevels
    UNION ALL SELECT 'minigamequestions', COUNT(*)::int FROM minigamequestions
    UNION ALL SELECT 'passwordresetcodes', COUNT(*)::int FROM passwordresetcodes
    UNION ALL SELECT 'usercollections', COUNT(*)::int FROM usercollections
    UNION ALL SELECT 'usercollectionwords', COUNT(*)::int FROM usercollectionwords
    UNION ALL SELECT 'userstats', COUNT(*)::int FROM userstats
  `
};
(async()=>{
  const out = {};
  for (const [k,q] of Object.entries(queries)) out[k] = (await pool.query(q)).rows;
  console.log(JSON.stringify(out, null, 2));
})().catch(e=>{ console.error(e.message); process.exitCode=1; }).finally(async()=>pool.end());