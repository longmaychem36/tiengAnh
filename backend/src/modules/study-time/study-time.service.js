const { getPool } = require('../../config/database');

const MAX_HEARTBEAT_SECONDS = 120;

function clampHeartbeatSeconds(value) {
  const seconds = Math.floor(Number(value) || 0);
  if (seconds <= 0) return 0;
  return Math.min(seconds, MAX_HEARTBEAT_SECONDS);
}

const studyTimeService = {
  async ensureTable() {
    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS StudyTimeDaily (
        UserId uuid NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
        ActivityDate date NOT NULL DEFAULT CURRENT_DATE,
        ActiveSeconds integer NOT NULL DEFAULT 0,
        UpdatedAt timestamp NOT NULL DEFAULT NOW(),
        PRIMARY KEY (UserId, ActivityDate)
      )
    `);
  },

  async recordHeartbeat(userId, activeSeconds) {
    const seconds = clampHeartbeatSeconds(activeSeconds);
    await this.ensureTable();

    if (seconds <= 0) {
      return { activeSeconds: 0 };
    }

    const pool = getPool();
    const result = await pool.query(`
      INSERT INTO StudyTimeDaily (UserId, ActivityDate, ActiveSeconds, UpdatedAt)
      VALUES ($1, CURRENT_DATE, $2, NOW())
      ON CONFLICT (UserId, ActivityDate)
      DO UPDATE SET
        ActiveSeconds = StudyTimeDaily.ActiveSeconds + EXCLUDED.ActiveSeconds,
        UpdatedAt = NOW()
      RETURNING UserId, ActivityDate, ActiveSeconds, UpdatedAt
    `, [userId, seconds]);

    const row = result.rows[0];
    return {
      activeSeconds: seconds,
      dailySeconds: Number(row?.activeseconds || 0),
      activityDate: row?.activitydate,
      updatedAt: row?.updatedat
    };
  }
};

module.exports = studyTimeService;
