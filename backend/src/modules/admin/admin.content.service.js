const { getPool, sql } = require('../../config/database');
const { ensureOnboardingSchema } = require('../onboarding/onboarding.schema');

const RECEPTIVE_CONFIG = {
  listening: {
    lessonTable: 'ListeningLessons',
    contentTable: 'ListeningSegments',
    speakerTable: 'ListeningSpeakers',
    vocabTable: 'ListeningVocabulary',
    questionTable: 'ListeningQuestions',
    contentLabel: 'segments'
  },
  reading: {
    lessonTable: 'ReadingLessons',
    contentTable: 'ReadingParagraphs',
    vocabTable: 'ReadingVocabulary',
    questionTable: 'ReadingQuestions',
    contentLabel: 'paragraphs'
  }
};

function getReceptiveConfig(skill) {
  const config = RECEPTIVE_CONFIG[skill];
  if (!config) throw new Error(`Unsupported receptive skill: ${skill}`);
  return config;
}

function mapLesson(row) {
  return {
    Id: row.id,
    Title: row.title,
    Description: row.description,
    Level: row.level,
    Topic: row.topic,
    Objective: row.objective,
    Duration: row.duration,
    PassageTitle: row.passagetitle,
    AudioUrl: row.audiourl,
    IsFoundation: row.isfoundation,
    OrderIndex: row.orderindex,
    CreatedAt: row.createdat,
    UpdatedAt: row.updatedat
  };
}

function createAdminError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isAdminCreator(role) {
  return ['admin', 'superadmin'].includes(String(role || '').toLowerCase());
}

async function assertAdminOwnedVocabularyCollection(pool, collectionId) {
  const result = await pool.query(`
    SELECT c.Id, u.Role as CreatorRole
    FROM UserCollections c
    LEFT JOIN Users u ON u.Id = c.UserId
    WHERE c.Id = $1 AND c.IsPublic = true
    LIMIT 1
  `, [collectionId]);

  const collection = result.rows[0];
  if (!collection) {
    throw createAdminError('Vocabulary collection not found', 404);
  }
  if (!isAdminCreator(collection.creatorrole)) {
    throw createAdminError('Admin can only manage words in admin-created vocabulary collections.', 403);
  }
}

async function assertAdminOwnedVocabularyWord(pool, wordId) {
  const result = await pool.query(`
    SELECT w.Id, c.Id as CollectionId, u.Role as CreatorRole
    FROM UserCollectionWords w
    INNER JOIN UserCollections c ON c.Id = w.CollectionId
    LEFT JOIN Users u ON u.Id = c.UserId
    WHERE w.Id = $1 AND c.IsPublic = true
    LIMIT 1
  `, [wordId]);

  const word = result.rows[0];
  if (!word) {
    throw createAdminError('Vocabulary word not found', 404);
  }
  if (!isAdminCreator(word.creatorrole)) {
    throw createAdminError('Admin can only manage words in admin-created vocabulary collections.', 403);
  }
}

function mapContent(skill, row) {
  if (skill === 'listening') {
    return {
      Id: row.id,
      LessonId: row.lessonid,
      SpeakerId: row.speakerid,
      Speaker: row.speaker,
      SpeakerName: row.speakername || row.speaker,
      SpeakerGender: row.speakergender,
      Text: row.text,
      OrderIndex: row.orderindex
    };
  }

  return {
    Id: row.id,
    LessonId: row.lessonid,
    Content: row.content,
    OrderIndex: row.orderindex
  };
}

function mapSpeaker(row) {
  return {
    Id: row.id,
    LessonId: row.lessonid,
    Name: row.name,
    Gender: row.gender,
    VoiceName: row.voicename,
    VoiceURI: row.voiceuri,
    OrderIndex: row.orderindex,
    CreatedAt: row.createdat,
    UpdatedAt: row.updatedat
  };
}

function mapVocab(row) {
  return {
    Id: row.id,
    LessonId: row.lessonid,
    Word: row.word,
    Meaning: row.meaning,
    OrderIndex: row.orderindex
  };
}

function mapQuestion(row) {
  return {
    Id: row.id,
    LessonId: row.lessonid,
    QuestionType: row.questiontype,
    Prompt: row.prompt,
    OptionA: row.optiona,
    OptionB: row.optionb,
    OptionC: row.optionc,
    OptionD: row.optiond,
    CorrectAnswer: row.correctanswer,
    CorrectBoolean: row.correctboolean,
    AcceptedAnswers: row.acceptedanswers,
    Explanation: row.explanation,
    OrderIndex: row.orderindex
  };
}

const adminContentService = {
  // ========== SPEAKING MANAGEMENT ==========
  async getSpeakingLessons() {
    await ensureOnboardingSchema();
    const pool = getPool();
    const res = await pool.request().query(`SELECT * FROM SpeakingLessons ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createSpeakingLesson(data) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const res = await pool.request()
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('isFoundation', sql.Bit, data.IsFoundation === true || data.IsFoundation === 'true')
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO SpeakingLessons (Title, Description, IsFoundation, OrderIndex)
        VALUES (@title, @desc, @isFoundation, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateSpeakingLesson(id, data) {
    await ensureOnboardingSchema();
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('isFoundation', sql.Bit, data.IsFoundation === true || data.IsFoundation === 'true')
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE SpeakingLessons 
        SET Title = @title, Description = @desc, IsFoundation = @isFoundation, OrderIndex = @order
        WHERE Id = @id
      `);
  },

  async deleteSpeakingLesson(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM SpeakingLessons WHERE Id = @id`);
  },

  async getSpeakingQuestions(lessonId) {
    const pool = getPool();
    const res = await pool.request().input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`SELECT * FROM SpeakingQuestions WHERE LessonId = @lessonId ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createSpeakingQuestion(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, data.LessonId)
      .input('question', sql.NVarChar, data.Question)
      .input('translation', sql.NVarChar, data.Translation)
      .input('o1', sql.NVarChar, data.Option1)
      .input('o1vi', sql.NVarChar, data.Option1VI)
      .input('o2', sql.NVarChar, data.Option2)
      .input('o2vi', sql.NVarChar, data.Option2VI)
      .input('o3', sql.NVarChar, data.Option3)
      .input('o3vi', sql.NVarChar, data.Option3VI)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO SpeakingQuestions (LessonId, Question, Translation, Option1, Option1VI, Option2, Option2VI, Option3, Option3VI, OrderIndex)
        VALUES (@lessonId, @question, @translation, @o1, @o1vi, @o2, @o2vi, @o3, @o3vi, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateSpeakingQuestion(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('question', sql.NVarChar, data.Question)
      .input('translation', sql.NVarChar, data.Translation)
      .input('o1', sql.NVarChar, data.Option1)
      .input('o1vi', sql.NVarChar, data.Option1VI)
      .input('o2', sql.NVarChar, data.Option2)
      .input('o2vi', sql.NVarChar, data.Option2VI)
      .input('o3', sql.NVarChar, data.Option3)
      .input('o3vi', sql.NVarChar, data.Option3VI)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE SpeakingQuestions 
        SET Question = @question, Translation = @translation, 
            Option1 = @o1, Option1VI = @o1vi, 
            Option2 = @o2, Option2VI = @o2vi, 
            Option3 = @o3, Option3VI = @o3vi, 
            OrderIndex = @order
        WHERE Id = @id
      `);
  },

  async deleteSpeakingQuestion(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM SpeakingQuestions WHERE Id = @id`);
  },

  // ========== WRITING MANAGEMENT ==========
  async getWritingLessons() {
    await ensureOnboardingSchema();
    const pool = getPool();
    const res = await pool.request().query(`SELECT * FROM WritingLessons ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createWritingLesson(data) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const res = await pool.request()
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('passageEN', sql.NText, data.PassageEN || data.passageEN || '')
      .input('passageVI', sql.NText, data.PassageVI || data.passageVI || '')
      .input('isFoundation', sql.Bit, data.IsFoundation === true || data.IsFoundation === 'true')
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO WritingLessons (Title, Description, PassageEN, PassageVI, IsFoundation, OrderIndex)
        VALUES (@title, @desc, @passageEN, @passageVI, @isFoundation, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateWritingLesson(id, data) {
    await ensureOnboardingSchema();
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('passageEN', sql.NText, data.PassageEN || data.passageEN || '')
      .input('passageVI', sql.NText, data.PassageVI || data.passageVI || '')
      .input('isFoundation', sql.Bit, data.IsFoundation === true || data.IsFoundation === 'true')
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE WritingLessons 
        SET Title = @title, Description = @desc, PassageEN = @passageEN, PassageVI = @passageVI, IsFoundation = @isFoundation, OrderIndex = @order
        WHERE Id = @id
      `);
  },

  async deleteWritingLesson(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM WritingLessons WHERE Id = @id`);
  },

  async getWritingExercises(lessonId) {
    const pool = getPool();
    const res = await pool.request().input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`SELECT * FROM WritingExercises WHERE LessonId = @lessonId ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createWritingExercise(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, data.LessonId)
      .input('vi', sql.NVarChar, data.ContentVI)
      .input('en', sql.NVarChar, data.CorrectAnswerEN)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO WritingExercises (LessonId, ContentVI, CorrectAnswerEN, OrderIndex)
        VALUES (@lessonId, @vi, @en, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateWritingExercise(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('vi', sql.NVarChar, data.ContentVI)
      .input('en', sql.NVarChar, data.CorrectAnswerEN)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE WritingExercises 
        SET ContentVI = @vi, CorrectAnswerEN = @en, OrderIndex = @order
        WHERE Id = @id
      `);
  },

  async deleteWritingExercise(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM WritingExercises WHERE Id = @id`);
  },

  async getWritingVocab(exerciseId) {
    const pool = getPool();
    const res = await pool.request().input('exerciseId', sql.UniqueIdentifier, exerciseId)
      .query(`SELECT * FROM WritingVocab WHERE ExerciseId = @exerciseId`);
    return res.recordset;
  },

  async createWritingVocab(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('exId', sql.UniqueIdentifier, data.ExerciseId)
      .input('word', sql.NVarChar, data.Word)
      .input('meaning', sql.NVarChar, data.Meaning)
      .query(`
        INSERT INTO WritingVocab (ExerciseId, Word, Meaning)
        VALUES (@exId, @word, @meaning) RETURNING *
      `);
    return res.recordset[0];
  },

  async deleteWritingVocab(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM WritingVocab WHERE Id = @id`);
  },

  // ========== LISTENING / READING MANAGEMENT ==========
  async getReceptiveLessons(skill) {
    await ensureOnboardingSchema();
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    const res = await pool.query(`
      SELECT *
      FROM ${config.lessonTable}
      ORDER BY OrderIndex ASC, CreatedAt ASC
    `);
    return res.rows.map(mapLesson);
  },

  async createReceptiveLesson(skill, data) {
    await ensureOnboardingSchema();
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    const res = await pool.query(`
      INSERT INTO ${config.lessonTable}
        (Title, Description, Level, Topic, Objective, Duration, PassageTitle, AudioUrl, IsFoundation, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *
    `, [
      data.Title,
      data.Description || '',
      data.Level || 'A1',
      data.Topic || '',
      data.Objective || '',
      data.Duration || '',
      data.PassageTitle || '',
      data.AudioUrl || '',
      data.IsFoundation === true || data.IsFoundation === 'true',
      Number(data.OrderIndex || 0)
    ]);
    return mapLesson(res.rows[0]);
  },

  async updateReceptiveLesson(skill, id, data) {
    await ensureOnboardingSchema();
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`
      UPDATE ${config.lessonTable}
      SET Title = $1,
          Description = $2,
          Level = $3,
          Topic = $4,
          Objective = $5,
          Duration = $6,
          PassageTitle = $7,
          AudioUrl = $8,
          IsFoundation = $9,
          OrderIndex = $10,
          UpdatedAt = NOW()
      WHERE Id = $11
    `, [
      data.Title,
      data.Description || '',
      data.Level || 'A1',
      data.Topic || '',
      data.Objective || '',
      data.Duration || '',
      data.PassageTitle || '',
      data.AudioUrl || '',
      data.IsFoundation === true || data.IsFoundation === 'true',
      Number(data.OrderIndex || 0),
      id
    ]);
  },

  async deleteReceptiveLesson(skill, id) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`DELETE FROM ${config.lessonTable} WHERE Id = $1`, [id]);
  },

  async getListeningSpeakers(lessonId) {
    const config = getReceptiveConfig('listening');
    const pool = getPool();
    const res = await pool.query(`
      SELECT *
      FROM ${config.speakerTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC, Name ASC
    `, [lessonId]);
    return res.rows.map(mapSpeaker);
  },

  async createListeningSpeaker(data) {
    const config = getReceptiveConfig('listening');
    const pool = getPool();
    const res = await pool.query(`
      INSERT INTO ${config.speakerTable}
        (LessonId, Name, Gender, VoiceName, VoiceURI, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `, [
      data.LessonId,
      data.Name || 'Narrator',
      data.Gender || 'female',
      data.VoiceName || '',
      data.VoiceURI || '',
      Number(data.OrderIndex || 0)
    ]);
    return mapSpeaker(res.rows[0]);
  },

  async updateListeningSpeaker(id, data) {
    const config = getReceptiveConfig('listening');
    const pool = getPool();
    await pool.query(`
      UPDATE ${config.speakerTable}
      SET Name = $1,
          Gender = $2,
          VoiceName = $3,
          VoiceURI = $4,
          OrderIndex = $5,
          UpdatedAt = NOW()
      WHERE Id = $6
    `, [
      data.Name || 'Narrator',
      data.Gender || 'female',
      data.VoiceName || '',
      data.VoiceURI || '',
      Number(data.OrderIndex || 0),
      id
    ]);
  },

  async deleteListeningSpeaker(id) {
    const config = getReceptiveConfig('listening');
    const pool = getPool();
    await pool.query(`DELETE FROM ${config.speakerTable} WHERE Id = $1`, [id]);
  },

  async getReceptiveContent(skill, lessonId) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    if (skill === 'listening') {
      const res = await pool.query(`
        SELECT s.*,
               sp.Name AS SpeakerName,
               sp.Gender AS SpeakerGender
        FROM ${config.contentTable} s
        LEFT JOIN ${config.speakerTable} sp ON sp.Id = s.SpeakerId
        WHERE s.LessonId = $1
        ORDER BY s.OrderIndex ASC
      `, [lessonId]);
      return res.rows.map((row) => mapContent(skill, row));
    }

    const res = await pool.query(`
      SELECT *
      FROM ${config.contentTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC
    `, [lessonId]);
    return res.rows.map((row) => mapContent(skill, row));
  },

  async createReceptiveContent(skill, data) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    let res;

    if (skill === 'listening') {
      const speakerResult = await pool.query(`
        SELECT Name
        FROM ${config.speakerTable}
        WHERE Id = $1 AND LessonId = $2
      `, [data.SpeakerId || null, data.LessonId]);
      const speakerName = speakerResult.rows[0]?.name || data.Speaker || '';

      res = await pool.query(`
        INSERT INTO ${config.contentTable}
          (LessonId, SpeakerId, Speaker, Text, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        data.LessonId,
        data.SpeakerId || null,
        speakerName,
        data.Text || '',
        Number(data.OrderIndex || 0)
      ]);
    } else {
      res = await pool.query(`
        INSERT INTO ${config.contentTable}
          (LessonId, Content, OrderIndex)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [
        data.LessonId,
        data.Content || '',
        Number(data.OrderIndex || 0)
      ]);
    }

    return mapContent(skill, res.rows[0]);
  },

  async updateReceptiveContent(skill, id, data) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();

    if (skill === 'listening') {
      const speakerResult = await pool.query(`
        SELECT Name
        FROM ${config.speakerTable}
        WHERE Id = $1
      `, [data.SpeakerId || null]);
      const speakerName = speakerResult.rows[0]?.name || data.Speaker || '';

      await pool.query(`
        UPDATE ${config.contentTable}
        SET SpeakerId = $1, Speaker = $2, Text = $3, OrderIndex = $4
        WHERE Id = $5
      `, [
        data.SpeakerId || null,
        speakerName,
        data.Text || '',
        Number(data.OrderIndex || 0),
        id
      ]);
      return;
    }

    await pool.query(`
      UPDATE ${config.contentTable}
      SET Content = $1, OrderIndex = $2
      WHERE Id = $3
    `, [data.Content || '', Number(data.OrderIndex || 0), id]);
  },

  async deleteReceptiveContent(skill, id) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`DELETE FROM ${config.contentTable} WHERE Id = $1`, [id]);
  },

  async getReceptiveVocab(skill, lessonId) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    const res = await pool.query(`
      SELECT *
      FROM ${config.vocabTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC, Word ASC
    `, [lessonId]);
    return res.rows.map(mapVocab);
  },

  async createReceptiveVocab(skill, data) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    const res = await pool.query(`
      INSERT INTO ${config.vocabTable}
        (LessonId, Word, Meaning, OrderIndex)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      data.LessonId,
      data.Word || '',
      data.Meaning || '',
      Number(data.OrderIndex || 0)
    ]);
    return mapVocab(res.rows[0]);
  },

  async updateReceptiveVocab(skill, id, data) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`
      UPDATE ${config.vocabTable}
      SET Word = $1, Meaning = $2, OrderIndex = $3
      WHERE Id = $4
    `, [data.Word || '', data.Meaning || '', Number(data.OrderIndex || 0), id]);
  },

  async deleteReceptiveVocab(skill, id) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`DELETE FROM ${config.vocabTable} WHERE Id = $1`, [id]);
  },

  async getReceptiveQuestions(skill, lessonId) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    const res = await pool.query(`
      SELECT *
      FROM ${config.questionTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC
    `, [lessonId]);
    return res.rows.map(mapQuestion);
  },

  async createReceptiveQuestion(skill, data) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    const res = await pool.query(`
      INSERT INTO ${config.questionTable}
        (LessonId, QuestionType, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, CorrectBoolean, AcceptedAnswers, Explanation, OrderIndex)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      data.LessonId,
      data.QuestionType || 'multiple_choice',
      data.Prompt || '',
      data.OptionA || '',
      data.OptionB || '',
      data.OptionC || '',
      data.OptionD || '',
      data.CorrectAnswer || '',
      data.CorrectBoolean === true || data.CorrectBoolean === 'true',
      data.AcceptedAnswers || '',
      data.Explanation || '',
      Number(data.OrderIndex || 0)
    ]);
    return mapQuestion(res.rows[0]);
  },

  async updateReceptiveQuestion(skill, id, data) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`
      UPDATE ${config.questionTable}
      SET QuestionType = $1,
          Prompt = $2,
          OptionA = $3,
          OptionB = $4,
          OptionC = $5,
          OptionD = $6,
          CorrectAnswer = $7,
          CorrectBoolean = $8,
          AcceptedAnswers = $9,
          Explanation = $10,
          OrderIndex = $11
      WHERE Id = $12
    `, [
      data.QuestionType || 'multiple_choice',
      data.Prompt || '',
      data.OptionA || '',
      data.OptionB || '',
      data.OptionC || '',
      data.OptionD || '',
      data.CorrectAnswer || '',
      data.CorrectBoolean === true || data.CorrectBoolean === 'true',
      data.AcceptedAnswers || '',
      data.Explanation || '',
      Number(data.OrderIndex || 0),
      id
    ]);
  },

  async deleteReceptiveQuestion(skill, id) {
    const config = getReceptiveConfig(skill);
    const pool = getPool();
    await pool.query(`DELETE FROM ${config.questionTable} WHERE Id = $1`, [id]);
  },

  // ========== GRAMMAR MANAGEMENT ==========
  async getGrammarCategories() {
    const pool = getPool();
    const res = await pool.request().query(`SELECT * FROM GrammarCategories ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createGrammarCategory(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('name', sql.NVarChar, data.Name)
      .input('namevi', sql.NVarChar, data.NameVI)
      .input('icon', sql.NVarChar, data.Icon || '📘')
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO GrammarCategories (Name, NameVI, Icon, OrderIndex)
        VALUES (@name, @namevi, @icon, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateGrammarCategory(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, data.Name)
      .input('namevi', sql.NVarChar, data.NameVI)
      .input('icon', sql.NVarChar, data.Icon || '📘')
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE GrammarCategories 
        SET Name = @name, NameVI = @namevi, Icon = @icon, OrderIndex = @order
        WHERE Id = @id
      `);
  },

  async deleteGrammarCategory(id) {
    const pool = getPool();
    await pool.request().input('id', sql.Int, id).query(`DELETE FROM GrammarCategories WHERE Id = @id`);
  },

  async getGrammarTopics(categoryId) {
    const pool = getPool();
    const res = await pool.request().input('catId', sql.Int, categoryId)
      .query(`SELECT * FROM GrammarTopics WHERE CategoryId = @catId ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createGrammarTopic(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('catId', sql.Int, data.CategoryId)
      .input('title', sql.NVarChar, data.Title)
      .input('titlevi', sql.NVarChar, data.TitleVI)
      .input('content', sql.NVarChar, data.Content)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO GrammarTopics (CategoryId, Title, TitleVI, Content, OrderIndex)
        VALUES (@catId, @title, @titlevi, @content, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateGrammarTopic(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, data.Title)
      .input('titlevi', sql.NVarChar, data.TitleVI)
      .input('content', sql.NVarChar, data.Content)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE GrammarTopics 
        SET Title = @title, TitleVI = @titlevi, Content = @content, OrderIndex = @order
        WHERE Id = @id
      `);
  },

  async deleteGrammarTopic(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM GrammarTopics WHERE Id = @id`);
  },

  async getGrammarQuizzes(topicId) {
    const pool = getPool();
    const res = await pool.request().input('topicId', sql.UniqueIdentifier, topicId)
      .query(`SELECT * FROM GrammarQuiz WHERE TopicId = @topicId`);
    return res.recordset;
  },

  async createGrammarQuiz(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('topicId', sql.UniqueIdentifier, data.TopicId)
      .input('q', sql.NVarChar, data.Question)
      .input('a', sql.NVarChar, data.OptionA)
      .input('b', sql.NVarChar, data.OptionB)
      .input('c', sql.NVarChar, data.OptionC)
      .input('d', sql.NVarChar, data.OptionD)
      .input('ans', sql.NVarChar, data.CorrectAnswer)
      .input('exp', sql.NVarChar, data.Explanation)
      .query(`
        INSERT INTO GrammarQuiz (TopicId, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation)
        VALUES (@topicId, @q, @a, @b, @c, @d, @ans, @exp) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateGrammarQuiz(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('q', sql.NVarChar, data.Question)
      .input('a', sql.NVarChar, data.OptionA)
      .input('b', sql.NVarChar, data.OptionB)
      .input('c', sql.NVarChar, data.OptionC)
      .input('d', sql.NVarChar, data.OptionD)
      .input('ans', sql.NVarChar, data.CorrectAnswer)
      .input('exp', sql.NVarChar, data.Explanation)
      .query(`
        UPDATE GrammarQuiz 
        SET Question = @q, OptionA = @a, OptionB = @b, OptionC = @c, OptionD = @d, CorrectAnswer = @ans, Explanation = @exp
        WHERE Id = @id
      `);
  },

  async deleteGrammarQuiz(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query(`DELETE FROM GrammarQuiz WHERE Id = @id`);
  },

  async getVocabularyCollections(status = 'all') {
    const pool = getPool();
    const normalizedStatus = ['pending', 'approved', 'rejected'].includes(status) ? status : null;
    const result = await pool.query(`
      SELECT c.*,
             u.Username as CreatorName,
             u.Role as CreatorRole,
             reviewer.Username as ReviewerName,
             COUNT(w.Id)::int as WordCount
      FROM UserCollections c
      LEFT JOIN Users u ON u.Id = c.UserId
      LEFT JOIN Users reviewer ON reviewer.Id = c.ReviewedBy
      LEFT JOIN UserCollectionWords w ON w.CollectionId = c.Id
      WHERE c.IsPublic = true
        AND ($1::varchar IS NULL OR c.ReviewStatus = $1)
      GROUP BY c.Id, u.Username, u.Role, reviewer.Username
      ORDER BY
        CASE WHEN c.ReviewStatus = 'pending' THEN 0 ELSE 1 END,
        c.UpdatedAt DESC,
        c.CreatedAt DESC
    `, [normalizedStatus]);
    return result.rows.map((row) => ({
      Id: row.id,
      UserId: row.userid,
      Name: row.name,
      Description: row.description,
      IsPublic: row.ispublic,
      ReviewStatus: row.reviewstatus,
      SubmittedAt: row.submittedat,
      ReviewedAt: row.reviewedat,
      ReviewedBy: row.reviewedby,
      UpdatedAt: row.updatedat,
      CreatedAt: row.createdat,
      CreatorName: row.creatorname,
      CreatorRole: row.creatorrole,
      ReviewerName: row.reviewername,
      WordCount: row.wordcount
    }));
  },

  async createVocabularyCollection(adminUserId, data) {
    const pool = getPool();
    const result = await pool.query(`
      INSERT INTO UserCollections (UserId, Name, Description, IsPublic, ReviewStatus, SubmittedAt, ReviewedAt, ReviewedBy, UpdatedAt)
      VALUES ($1, $2, $3, true, 'approved', NOW(), NOW(), $1, NOW())
      RETURNING *
    `, [adminUserId, data.Name || data.name, data.Description || data.description || null]);
    return result.rows[0];
  },

  async updateVocabularyCollection(id, data) {
    const pool = getPool();
    await pool.query(`
      UPDATE UserCollections
      SET Name = $1,
          Description = $2,
          UpdatedAt = NOW()
      WHERE Id = $3 AND IsPublic = true
    `, [data.Name || data.name, data.Description || data.description || null, id]);
  },

  async reviewVocabularyCollection(id, status, reviewerId) {
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new Error('Invalid vocabulary review status');
    }
    const pool = getPool();
    await pool.query(`
      UPDATE UserCollections
      SET ReviewStatus = $1,
          ReviewedBy = $2,
          ReviewedAt = NOW(),
          UpdatedAt = NOW()
      WHERE Id = $3 AND IsPublic = true
    `, [status, reviewerId, id]);
  },

  async deleteVocabularyCollection(id) {
    const pool = getPool();
    await pool.query('DELETE FROM UserCollections WHERE Id = $1 AND IsPublic = true', [id]);
  },

  async getVocabularyWords(collectionId) {
    const pool = getPool();
    const result = await pool.query(`
      SELECT *
      FROM UserCollectionWords
      WHERE CollectionId = $1
      ORDER BY AddedAt ASC
    `, [collectionId]);
    return result.rows.map((row) => ({
      Id: row.id,
      CollectionId: row.collectionid,
      CustomWord: row.customword,
      CustomMeaning: row.custommeaning,
      CustomExample: row.customexample,
      AddedAt: row.addedat,
      UpdatedAt: row.updatedat
    }));
  },

  async addVocabularyWord(collectionId, data) {
    const pool = getPool();
    await assertAdminOwnedVocabularyCollection(pool, collectionId);
    const result = await pool.query(`
      INSERT INTO UserCollectionWords (CollectionId, DictionaryEntryId, CustomWord, CustomMeaning, CustomExample, UpdatedAt)
      VALUES ($1, NULL, $2, $3, $4, NOW())
      RETURNING *
    `, [collectionId, data.CustomWord || data.customWord, data.CustomMeaning || data.customMeaning || '', data.CustomExample || data.customExample || null]);
    await pool.query('UPDATE UserCollections SET UpdatedAt = NOW() WHERE Id = $1', [collectionId]);
    return result.rows[0];
  },

  async updateVocabularyWord(wordId, data) {
    const pool = getPool();
    await assertAdminOwnedVocabularyWord(pool, wordId);
    await pool.query(`
      UPDATE UserCollectionWords
      SET CustomWord = $1,
          CustomMeaning = $2,
          CustomExample = $3,
          UpdatedAt = NOW()
      WHERE Id = $4
    `, [data.CustomWord || data.customWord, data.CustomMeaning || data.customMeaning || '', data.CustomExample || data.customExample || null, wordId]);
  },

  async deleteVocabularyWord(wordId) {
    const pool = getPool();
    await assertAdminOwnedVocabularyWord(pool, wordId);
    await pool.query('DELETE FROM UserCollectionWords WHERE Id = $1', [wordId]);
  }
};

module.exports = adminContentService;
