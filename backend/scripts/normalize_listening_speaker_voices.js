require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const SPEAKERS = [
  {
    name: 'Alex',
    gender: 'male',
    voiceName: 'Microsoft David',
    voiceURI: '',
    orderIndex: 1
  },
  {
    name: 'Emma',
    gender: 'female',
    voiceName: 'Microsoft Zira',
    voiceURI: '',
    orderIndex: 2
  }
];

async function upsertSpeaker(pool, lessonId, speaker) {
  const existing = await pool.query(`
    SELECT Id
    FROM ListeningSpeakers
    WHERE LessonId = $1 AND OrderIndex = $2
    ORDER BY CreatedAt ASC NULLS LAST, Id ASC
    LIMIT 1
  `, [lessonId, speaker.orderIndex]);

  if (existing.rows[0]) {
    const result = await pool.query(`
      UPDATE ListeningSpeakers
      SET Name = $2,
          Gender = $3,
          VoiceName = $4,
          VoiceURI = $5,
          OrderIndex = $6,
          UpdatedAt = NOW()
      WHERE Id = $1
      RETURNING Id
    `, [
      existing.rows[0].id,
      speaker.name,
      speaker.gender,
      speaker.voiceName,
      speaker.voiceURI,
      speaker.orderIndex
    ]);
    return result.rows[0].id;
  }

  const result = await pool.query(`
    INSERT INTO ListeningSpeakers (LessonId, Name, Gender, VoiceName, VoiceURI, OrderIndex, UpdatedAt)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING Id
  `, [
    lessonId,
    speaker.name,
    speaker.gender,
    speaker.voiceName,
    speaker.voiceURI,
    speaker.orderIndex
  ]);
  return result.rows[0].id;
}

async function main() {
  await connectDB();
  const pool = getPool();

  await pool.query('BEGIN');
  try {
    const lessons = await pool.query(`
      SELECT Id, Title
      FROM ListeningLessons
      ORDER BY OrderIndex ASC, CreatedAt ASC
    `);

    let updatedLessons = 0;
    let updatedSegments = 0;

    for (const lesson of lessons.rows) {
      const speakerIds = [];
      for (const speaker of SPEAKERS) {
        speakerIds.push(await upsertSpeaker(pool, lesson.id, speaker));
      }

      const segments = await pool.query(`
        SELECT Id, OrderIndex
        FROM ListeningSegments
        WHERE LessonId = $1
        ORDER BY OrderIndex ASC, Id ASC
      `, [lesson.id]);

      for (let index = 0; index < segments.rows.length; index += 1) {
        const speakerIndex = index % SPEAKERS.length;
        await pool.query(`
          UPDATE ListeningSegments
          SET SpeakerId = $1,
              Speaker = $2
          WHERE Id = $3
        `, [speakerIds[speakerIndex], SPEAKERS[speakerIndex].name, segments.rows[index].id]);
        updatedSegments += 1;
      }

      updatedLessons += 1;
      console.log(`Updated ${lesson.title}: ${segments.rows.length} segments -> Alex/Emma`);
    }

    await pool.query('COMMIT');
    console.log(`Done. Updated ${updatedLessons} listening lessons and ${updatedSegments} segments.`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  } finally {
    await closeDB();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});