const { getPool, sql } = require('../../config/database');

const adminContentService = {
  // ========== SPEAKING MANAGEMENT ==========
  async getSpeakingLessons() {
    const pool = getPool();
    const res = await pool.request().query(`SELECT * FROM SpeakingLessons ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createSpeakingLesson(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO SpeakingLessons (Title, Description, OrderIndex)
        VALUES (@title, @desc, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateSpeakingLesson(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE SpeakingLessons 
        SET Title = @title, Description = @desc, OrderIndex = @order
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
    const pool = getPool();
    const res = await pool.request().query(`SELECT * FROM WritingLessons ORDER BY OrderIndex ASC`);
    return res.recordset;
  },

  async createWritingLesson(data) {
    const pool = getPool();
    const res = await pool.request()
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        INSERT INTO WritingLessons (Title, Description, OrderIndex)
        VALUES (@title, @desc, @order) RETURNING *
      `);
    return res.recordset[0];
  },

  async updateWritingLesson(id, data) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, data.Title)
      .input('desc', sql.NVarChar, data.Description)
      .input('order', sql.Int, data.OrderIndex || 0)
      .query(`
        UPDATE WritingLessons 
        SET Title = @title, Description = @desc, OrderIndex = @order
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
  }
};

module.exports = adminContentService;
