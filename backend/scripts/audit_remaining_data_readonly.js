const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const queries = {
  users: `SELECT id, username, email, role, createdat, onboardingcompleted, placementlevel FROM users ORDER BY createdat ASC`,
  userstats: `SELECT userid, exp, level, streakdays, lastlogin FROM userstats ORDER BY userid`,
  dailytasks: `SELECT id, userid, taskdate, skill, targettype, targetid, title, status, reason, createdat FROM dailytasks ORDER BY createdat ASC`,
  studytimedaily: `SELECT userid, activitydate, activeseconds, updatedat FROM studytimedaily ORDER BY activitydate ASC, userid`,
  gamelevels: `SELECT id, levelnumber, name, difficulty, timelimit, passscore, islocked, createdat FROM gamelevels ORDER BY levelnumber ASC`,
  minigamequestions: `SELECT id, levelid, questiontype, contenten, contentvi, correctanswer, options, orderindex FROM minigamequestions ORDER BY orderindex ASC`,
  passwordresetcodes: `SELECT id, userid, email, expiresat, usedat, createdat FROM passwordresetcodes ORDER BY createdat DESC LIMIT 20`,
  publiccollections: `SELECT id, userid, name, description, ispublic, reviewstatus, createdat FROM usercollections ORDER BY createdat ASC`
};

async function main() {
  const out = {};
  for (const [name, sql] of Object.entries(queries)) {
    try {
      const result = await pool.query(sql);
      out[name] = result.rows;
    } catch (err) {
      out[name] = { error: err.message };
    }
  }
  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
}).finally(async () => {
  await pool.end();
});