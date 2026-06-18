require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const skillTables = [
  {
    tableName: 'ListeningLessons',
    requiredContent: [
      { tableName: 'ListeningSegments', label: 'segments' },
      { tableName: 'ListeningQuestions', label: 'questions' }
    ]
  },
  {
    tableName: 'ReadingLessons',
    requiredContent: [
      { tableName: 'ReadingParagraphs', label: 'paragraphs' },
      { tableName: 'ReadingQuestions', label: 'questions' }
    ]
  },
  {
    tableName: 'SpeakingLessons',
    requiredContent: [
      { tableName: 'SpeakingQuestions', label: 'questions' }
    ]
  },
  {
    tableName: 'WritingLessons',
    requiredContent: [
      { tableName: 'WritingExercises', label: 'exercises' }
    ]
  }
];

async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND lower(table_name) = lower($1)
    ) AS exists
  `, [tableName]);
  return Boolean(result.rows[0]?.exists);
}

async function columnExists(pool, tableName, columnName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND lower(table_name) = lower($1)
        AND lower(column_name) = lower($2)
    ) AS exists
  `, [tableName, columnName]);
  return Boolean(result.rows[0]?.exists);
}

async function getContentCounts(pool, lessonId, requiredContent) {
  const counts = {};
  for (const item of requiredContent) {
    if (!await tableExists(pool, item.tableName)) {
      counts[item.label] = 0;
      continue;
    }
    const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${item.tableName} WHERE LessonId = $1`, [lessonId]);
    counts[item.label] = Number(result.rows[0]?.count || 0);
  }
  return counts;
}

async function auditSkill(pool, config) {
  const { tableName, requiredContent } = config;
  if (!await tableExists(pool, tableName)) {
    return { tableName, exists: false };
  }

  const hasIsFoundation = await columnExists(pool, tableName, 'IsFoundation');
  const rows = await pool.query(`
    SELECT
      Id,
      Title,
      ${hasIsFoundation ? 'COALESCE(IsFoundation, false)' : 'false'} AS is_foundation,
      COALESCE(OrderIndex, 0) AS order_index
    FROM ${tableName}
    ORDER BY ${hasIsFoundation ? 'COALESCE(IsFoundation, false) DESC,' : ''} COALESCE(OrderIndex, 0) ASC, Title ASC
  `);

  const summary = rows.rows.reduce((acc, row) => {
    const key = row.is_foundation ? 'foundation' : 'main';
    acc[key] += 1;
    return acc;
  }, { foundation: 0, main: 0 });

  const lessons = [];
  const emptyContentLessons = [];
  for (const row of rows.rows) {
    const contentCounts = await getContentCounts(pool, row.id, requiredContent);
    const missingContent = Object.entries(contentCounts)
      .filter(([, count]) => count === 0)
      .map(([label]) => label);
    const lesson = { ...row, content_counts: contentCounts };
    lessons.push(lesson);
    if (missingContent.length) {
      emptyContentLessons.push({
        id: row.id,
        title: row.title,
        missingContent
      });
    }
  }

  return {
    tableName,
    exists: true,
    hasIsFoundation,
    summary,
    emptyContentLessons,
    lessons
  };
}

async function auditGrammar(pool) {
  const categories = await pool.query(`
    SELECT
      gc.Id,
      gc.Name,
      gc.NameVI,
      gc.OrderIndex,
      COUNT(gt.Id)::int AS topic_count
    FROM GrammarCategories gc
    LEFT JOIN GrammarTopics gt ON gt.CategoryId = gc.Id
    GROUP BY gc.Id, gc.Name, gc.NameVI, gc.OrderIndex
    ORDER BY gc.OrderIndex ASC, gc.Name ASC
  `);

  const orphanTopics = await pool.query(`
    SELECT gt.Id, gt.Title, gt.CategoryId
    FROM GrammarTopics gt
    LEFT JOIN GrammarCategories gc ON gc.Id = gt.CategoryId
    WHERE gc.Id IS NULL
    ORDER BY gt.Title ASC
  `);

  const emptyTopics = await pool.query(`
    SELECT gt.Id, gt.Title, gt.CategoryId
    FROM GrammarTopics gt
    LEFT JOIN GrammarQuiz gq ON gq.TopicId = gt.Id
    GROUP BY gt.Id, gt.Title, gt.CategoryId
    HAVING COUNT(gq.Id) = 0
    ORDER BY gt.Title ASC
  `);

  return {
    categories: categories.rows,
    orphanTopics: orphanTopics.rows,
    emptyQuizTopics: emptyTopics.rows
  };
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const skills = [];
    for (const config of skillTables) {
      skills.push(await auditSkill(pool, config));
    }

    const grammar = await auditGrammar(pool);
    console.log(JSON.stringify({ skills, grammar }, null, 2));
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
