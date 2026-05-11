-- =============================
-- PostgreSQL Schema for English Learning System
-- =============================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================
-- LEVELS
-- =============================
CREATE TABLE LearningLevels (
    Id SERIAL PRIMARY KEY,
    Code VARCHAR(20) UNIQUE,
    Name VARCHAR(100),
    Description VARCHAR(255)
);

INSERT INTO LearningLevels (Code, Name, Description)
VALUES 
('BEGINNER', 'Người mới học', 'Chưa biết hoặc biết rất ít'),
('INTERMEDIATE', 'Cơ bản', 'Đã biết chút ít'),
('ADVANCED', 'Nâng cao', 'Đã học lâu, sử dụng tốt');

-- =============================
-- USERS
-- =============================
CREATE TABLE Users (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) CHECK (Role IN ('admin','user','superadmin')) DEFAULT 'user',
    LevelId INT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id)
);

-- =============================
-- COURSES
-- =============================
CREATE TABLE Courses (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Title VARCHAR(255),
    Description TEXT,
    LevelId INT,
    CreatedBy UUID,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- =============================
-- LESSONS
-- =============================
CREATE TABLE Lessons (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    CourseId UUID,
    Title VARCHAR(255),
    Content TEXT,
    Type VARCHAR(20),
    LevelId INT,
    OrderIndex INT,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id),
    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id)
);

-- =============================
-- LESSON MEDIA
-- =============================
CREATE TABLE LessonMedia (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    LessonId UUID,
    MediaType VARCHAR(20),
    MediaUrl VARCHAR(255),
    Description VARCHAR(255),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

-- =============================
-- DICTIONARY
-- =============================
CREATE TABLE DictionaryEntries (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Word VARCHAR(100) NOT NULL,
    Phonetic VARCHAR(100),
    PartOfSpeech VARCHAR(50),
    MeaningEN TEXT,
    MeaningVI TEXT,
    Example TEXT,
    AudioUrl VARCHAR(255),
    LevelId INT,
    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id)
);

CREATE TABLE DictionarySynonyms (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    WordId UUID,
    Synonym VARCHAR(100),
    FOREIGN KEY (WordId) REFERENCES DictionaryEntries(Id)
);

CREATE TABLE DictionarySearchHistory (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID,
    Word VARCHAR(100),
    SearchedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =============================
-- VOCABULARY
-- =============================
CREATE TABLE Vocabulary (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Word VARCHAR(100),
    Meaning TEXT,
    Example TEXT,
    AudioUrl VARCHAR(255),
    ImageUrl VARCHAR(255)
);

CREATE TABLE LessonVocabulary (
    LessonId UUID,
    VocabId UUID,
    PRIMARY KEY (LessonId, VocabId),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id),
    FOREIGN KEY (VocabId) REFERENCES Vocabulary(Id)
);

-- =============================
-- QUIZ
-- =============================
CREATE TABLE Quiz (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    LessonId UUID,
    Question TEXT,
    Type VARCHAR(50),
    CorrectAnswer VARCHAR(255),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

CREATE TABLE QuizOptions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    QuizId UUID,
    OptionText VARCHAR(255),
    FOREIGN KEY (QuizId) REFERENCES Quiz(Id)
);



-- =============================
-- USER PROGRESS
-- =============================
CREATE TABLE UserProgress (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID,
    LessonId UUID,
    Status VARCHAR(20),
    Score INT,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

CREATE TABLE UserVocabulary (
    UserId UUID,
    VocabId UUID,
    Status VARCHAR(20),
    PRIMARY KEY (UserId, VocabId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (VocabId) REFERENCES Vocabulary(Id)
);



-- =============================
-- GAMIFICATION
-- =============================
CREATE TABLE UserStats (
    UserId UUID PRIMARY KEY,
    Exp INT DEFAULT 0,
    Level INT DEFAULT 1,
    StreakDays INT DEFAULT 0,
    LastLogin TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Achievements (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(100),
    Description VARCHAR(255),
    Condition VARCHAR(255)
);

CREATE TABLE UserAchievements (
    UserId UUID,
    AchievementId UUID,
    UnlockedAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (UserId, AchievementId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (AchievementId) REFERENCES Achievements(Id)
);

-- =============================
-- USER COLLECTIONS
-- =============================
CREATE TABLE UserCollections (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE UserCollectionWords (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    CollectionId UUID NOT NULL,
    DictionaryEntryId UUID,
    CustomWord VARCHAR(255),
    CustomMeaning TEXT,
    CustomExample TEXT,
    AddedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (CollectionId) REFERENCES UserCollections(Id),
    FOREIGN KEY (DictionaryEntryId) REFERENCES DictionaryEntries(Id)
);

-- =============================
-- GRAMMAR
-- =============================
CREATE TABLE GrammarCategories (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    NameVI VARCHAR(100),
    Icon VARCHAR(10) DEFAULT '📘',
    OrderIndex INT DEFAULT 0
);

CREATE TABLE GrammarTopics (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    CategoryId INT,
    Title VARCHAR(200) NOT NULL,
    TitleVI VARCHAR(200),
    Content TEXT,
    OrderIndex INT DEFAULT 0,
    FOREIGN KEY (CategoryId) REFERENCES GrammarCategories(Id)
);

CREATE TABLE GrammarQuiz (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    TopicId UUID,
    Question TEXT NOT NULL,
    OptionA VARCHAR(255),
    OptionB VARCHAR(255),
    OptionC VARCHAR(255),
    OptionD VARCHAR(255),
    CorrectAnswer VARCHAR(1),
    Explanation TEXT,
    FOREIGN KEY (TopicId) REFERENCES GrammarTopics(Id)
);

-- =============================
-- MINI GAMES (NEW STRUCTURE)
-- =============================
CREATE TABLE GameSets (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(200) NOT NULL,
    Description VARCHAR(500),
    GameType VARCHAR(50) NOT NULL,
    Icon VARCHAR(10) DEFAULT '🎮',
    OrderIndex INT DEFAULT 0,
    UnlockCondition VARCHAR(200) DEFAULT 'none',
    CreatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE GameLevels (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    SetId UUID NOT NULL,
    LevelNumber INT NOT NULL,
    Name VARCHAR(200),
    Difficulty VARCHAR(20) DEFAULT 'easy',
    TimeLimit INT DEFAULT 60,
    PassScore INT DEFAULT 70,
    IsLocked BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (SetId) REFERENCES GameSets(Id)
);

CREATE TABLE MiniGameQuestions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    LevelId UUID NOT NULL,
    QuestionType VARCHAR(50) NOT NULL,
    ContentEN VARCHAR(500),
    ContentVI VARCHAR(500),
    AudioUrl VARCHAR(500),
    ImageUrl VARCHAR(500),
    CorrectAnswer VARCHAR(500),
    Options TEXT,
    OrderIndex INT DEFAULT 0,
    FOREIGN KEY (LevelId) REFERENCES GameLevels(Id)
);

CREATE TABLE UserGameProgress (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL,
    LevelId UUID NOT NULL,
    Score INT DEFAULT 0,
    Stars INT DEFAULT 0,
    IsCompleted BOOLEAN DEFAULT FALSE,
    BestTime INT DEFAULT 0,
    Attempts INT DEFAULT 0,
    CompletedAt TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (LevelId) REFERENCES GameLevels(Id)
);

-- =============================
-- SPEAKING MODULE
-- =============================
CREATE TABLE SpeakingLessons (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Title VARCHAR(255),
    Description TEXT,
    OrderIndex INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE SpeakingQuestions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    LessonId UUID,
    Question VARCHAR(500),
    Translation VARCHAR(500),
    Option1 VARCHAR(500),
    Option1VI VARCHAR(500),
    Option2 VARCHAR(500),
    Option2VI VARCHAR(500),
    Option3 VARCHAR(500),
    Option3VI VARCHAR(500),
    OrderIndex INT DEFAULT 0,
    FOREIGN KEY (LessonId) REFERENCES SpeakingLessons(Id) ON DELETE CASCADE
);

CREATE TABLE SpeakingProgress (
    UserId UUID,
    LessonId UUID,
    Status VARCHAR(50) DEFAULT 'in_progress',
    Score FLOAT DEFAULT 0,
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (UserId, LessonId)
);

-- =============================
-- WRITING MODULE
-- =============================
CREATE TABLE WritingLessons (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Title VARCHAR(255),
    Description TEXT,
    OrderIndex INT,
    CreatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE WritingExercises (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    LessonId UUID,
    ContentVI TEXT,
    CorrectAnswerEN TEXT,
    OrderIndex INT,
    FOREIGN KEY (LessonId) REFERENCES WritingLessons(Id) ON DELETE CASCADE
);

CREATE TABLE WritingVocab (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ExerciseId UUID,
    Word VARCHAR(100),
    Meaning VARCHAR(255),
    FOREIGN KEY (ExerciseId) REFERENCES WritingExercises(Id) ON DELETE CASCADE
);

CREATE TABLE WritingProgress (
    UserId UUID,
    LessonId UUID,
    Status VARCHAR(50),
    Score FLOAT,
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(UserId, LessonId)
);

-- =============================
-- INDEXES
-- =============================
CREATE INDEX idx_user_email ON Users(Email);
CREATE INDEX idx_dictionary_word ON DictionaryEntries(Word);
CREATE INDEX idx_vocab_word ON Vocabulary(Word);

CREATE INDEX idx_progress_user ON UserProgress(UserId);
CREATE INDEX idx_lesson_level ON Lessons(LevelId);
CREATE INDEX idx_course_level ON Courses(LevelId);
CREATE INDEX idx_dictionary_level ON DictionaryEntries(LevelId);
CREATE INDEX idx_media_lesson ON LessonMedia(LessonId);