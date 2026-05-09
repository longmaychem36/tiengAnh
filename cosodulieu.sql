-- =============================
-- RESET DATABASE
-- =============================
IF DB_ID('EnglishLearningSystem') IS NOT NULL
BEGIN
    ALTER DATABASE EnglishLearningSystem SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE EnglishLearningSystem;
END
GO

CREATE DATABASE EnglishLearningSystem;
GO

USE EnglishLearningSystem;
GO

-- =============================
-- LEVELS
-- =============================
CREATE TABLE LearningLevels (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Code NVARCHAR(20) UNIQUE,
    Name NVARCHAR(100),
    Description NVARCHAR(255)
);

INSERT INTO LearningLevels (Code, Name, Description)
VALUES 
('BEGINNER', N'Người mới học', N'Chưa biết hoặc biết rất ít'),
('INTERMEDIATE', N'Cơ bản', N'Đã biết chút ít'),
('ADVANCED', N'Nâng cao', N'Đã học lâu, sử dụng tốt');

-- =============================
-- USERS
-- =============================
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) CHECK (Role IN ('admin','user', 'superadmin')) DEFAULT 'user',
    LevelId INT,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id)
);

-- =============================
-- COURSES
-- =============================
CREATE TABLE Courses (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(255),
    Description NVARCHAR(MAX),
    LevelId INT,
    CreatedBy UNIQUEIDENTIFIER,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- =============================
-- LESSONS
-- =============================
CREATE TABLE Lessons (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CourseId UNIQUEIDENTIFIER,
    Title NVARCHAR(255),
    Content NVARCHAR(MAX),
    Type NVARCHAR(20),
    LevelId INT,
    OrderIndex INT,

    FOREIGN KEY (CourseId) REFERENCES Courses(Id),
    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id)
);

-- =============================
-- LESSON MEDIA (IMAGE / AUDIO / VIDEO)
-- =============================
CREATE TABLE LessonMedia (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    LessonId UNIQUEIDENTIFIER,
    MediaType NVARCHAR(20), -- image / audio / video
    MediaUrl NVARCHAR(255),
    Description NVARCHAR(255),

    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

-- =============================
-- DICTIONARY
-- =============================
CREATE TABLE DictionaryEntries (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Word NVARCHAR(100) NOT NULL,
    Phonetic NVARCHAR(100),
    PartOfSpeech NVARCHAR(50),
    MeaningEN NVARCHAR(MAX),
    MeaningVI NVARCHAR(MAX),
    Example NVARCHAR(MAX),
    AudioUrl NVARCHAR(255),
    LevelId INT,

    FOREIGN KEY (LevelId) REFERENCES LearningLevels(Id)
);

CREATE TABLE DictionarySynonyms (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    WordId UNIQUEIDENTIFIER,
    Synonym NVARCHAR(100),

    FOREIGN KEY (WordId) REFERENCES DictionaryEntries(Id)
);

CREATE TABLE DictionarySearchHistory (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    Word NVARCHAR(100),
    SearchedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =============================
-- VOCABULARY
-- =============================
CREATE TABLE Vocabulary (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Word NVARCHAR(100),
    Meaning NVARCHAR(MAX),
    Example NVARCHAR(MAX),
    AudioUrl NVARCHAR(255),
    ImageUrl NVARCHAR(255)
);

CREATE TABLE LessonVocabulary (
    LessonId UNIQUEIDENTIFIER,
    VocabId UNIQUEIDENTIFIER,

    PRIMARY KEY (LessonId, VocabId),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id),
    FOREIGN KEY (VocabId) REFERENCES Vocabulary(Id)
);

-- =============================
-- QUIZ
-- =============================
CREATE TABLE Quiz (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    LessonId UNIQUEIDENTIFIER,
    Question NVARCHAR(MAX),
    Type NVARCHAR(50),
    CorrectAnswer NVARCHAR(255),

    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

CREATE TABLE QuizOptions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    QuizId UNIQUEIDENTIFIER,
    OptionText NVARCHAR(255),

    FOREIGN KEY (QuizId) REFERENCES Quiz(Id)
);

-- =============================
-- GAMES
-- =============================
CREATE TABLE Games (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100),
    Type NVARCHAR(50),
    Difficulty NVARCHAR(20)
);

CREATE TABLE GameQuestions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GameId UNIQUEIDENTIFIER,
    Question NVARCHAR(MAX),
    QuestionType NVARCHAR(50), -- text / image / audio
    CorrectAnswer NVARCHAR(255),
    AudioUrl NVARCHAR(255),
    ImageUrl NVARCHAR(255),

    FOREIGN KEY (GameId) REFERENCES Games(Id)
);

CREATE TABLE GameOptions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    QuestionId UNIQUEIDENTIFIER,
    OptionText NVARCHAR(255),

    FOREIGN KEY (QuestionId) REFERENCES GameQuestions(Id)
);

CREATE TABLE UserGameSession (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    GameId UNIQUEIDENTIFIER,
    Score INT,
    Duration INT,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (GameId) REFERENCES Games(Id)
);

-- =============================
-- USER PROGRESS
-- =============================
CREATE TABLE UserProgress (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    LessonId UNIQUEIDENTIFIER,
    Status NVARCHAR(20),
    Score INT,

    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

CREATE TABLE UserVocabulary (
    UserId UNIQUEIDENTIFIER,
    VocabId UNIQUEIDENTIFIER,
    Status NVARCHAR(20),

    PRIMARY KEY (UserId, VocabId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (VocabId) REFERENCES Vocabulary(Id)
);

-- =============================
-- SPEAKING
-- =============================
CREATE TABLE SpeakingRecords (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    LessonId UNIQUEIDENTIFIER,
    AudioUrl NVARCHAR(255),
    Score FLOAT,
    Feedback NVARCHAR(MAX),

    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

-- =============================
-- GAMIFICATION
-- =============================
CREATE TABLE UserStats (
    UserId UNIQUEIDENTIFIER PRIMARY KEY,
    Exp INT DEFAULT 0,
    Level INT DEFAULT 1,
    StreakDays INT DEFAULT 0,
    LastLogin DATETIME,

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Achievements (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100),
    Description NVARCHAR(255),
    Condition NVARCHAR(255)
);

CREATE TABLE UserAchievements (
    UserId UNIQUEIDENTIFIER,
    AchievementId UNIQUEIDENTIFIER,
    UnlockedAt DATETIME DEFAULT GETDATE(),

    PRIMARY KEY (UserId, AchievementId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (AchievementId) REFERENCES Achievements(Id)
);

-- =============================
-- USER COLLECTIONS
-- =============================
CREATE TABLE UserCollections (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE UserCollectionWords (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CollectionId UNIQUEIDENTIFIER NOT NULL,
    DictionaryEntryId UNIQUEIDENTIFIER,
    CustomWord NVARCHAR(255),
    CustomMeaning NVARCHAR(MAX),
    CustomExample NVARCHAR(MAX),
    AddedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (CollectionId) REFERENCES UserCollections(Id),
    FOREIGN KEY (DictionaryEntryId) REFERENCES DictionaryEntries(Id)
);

-- =============================
-- GRAMMAR
-- =============================
CREATE TABLE GrammarCategories (
    Id INT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    NameVI NVARCHAR(100),
    Icon NVARCHAR(10) DEFAULT '??',
    OrderIndex INT DEFAULT 0
);

CREATE TABLE GrammarTopics (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CategoryId INT,
    Title NVARCHAR(200) NOT NULL,
    TitleVI NVARCHAR(200),
    Content NVARCHAR(MAX),
    OrderIndex INT DEFAULT 0,

    FOREIGN KEY (CategoryId) REFERENCES GrammarCategories(Id)
);

CREATE TABLE GrammarQuiz (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TopicId UNIQUEIDENTIFIER,
    Question NVARCHAR(MAX) NOT NULL,
    OptionA NVARCHAR(255),
    OptionB NVARCHAR(255),
    OptionC NVARCHAR(255),
    OptionD NVARCHAR(255),
    CorrectAnswer NVARCHAR(1),
    Explanation NVARCHAR(MAX),

    FOREIGN KEY (TopicId) REFERENCES GrammarTopics(Id)
);

-- =============================
-- MINI GAMES (NEW STRUCTURE)
-- =============================
CREATE TABLE GameSets (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    GameType NVARCHAR(50) NOT NULL,
    Icon NVARCHAR(10) DEFAULT '??',
    OrderIndex INT DEFAULT 0,
    UnlockCondition NVARCHAR(200) DEFAULT 'none',
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE GameLevels (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SetId UNIQUEIDENTIFIER NOT NULL,
    LevelNumber INT NOT NULL,
    Name NVARCHAR(200),
    Difficulty NVARCHAR(20) DEFAULT 'easy',
    TimeLimit INT DEFAULT 60,
    PassScore INT DEFAULT 70,
    IsLocked BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (SetId) REFERENCES GameSets(Id)
);

CREATE TABLE MiniGameQuestions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    LevelId UNIQUEIDENTIFIER NOT NULL,
    QuestionType NVARCHAR(50) NOT NULL,
    ContentEN NVARCHAR(500),
    ContentVI NVARCHAR(500),
    AudioUrl NVARCHAR(500),
    ImageUrl NVARCHAR(500),
    CorrectAnswer NVARCHAR(500),
    Options NVARCHAR(MAX),
    OrderIndex INT DEFAULT 0,

    FOREIGN KEY (LevelId) REFERENCES GameLevels(Id)
);

CREATE TABLE UserGameProgress (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    LevelId UNIQUEIDENTIFIER NOT NULL,
    Score INT DEFAULT 0,
    Stars INT DEFAULT 0,
    IsCompleted BIT DEFAULT 0,
    BestTime INT DEFAULT 0,
    Attempts INT DEFAULT 0,
    CompletedAt DATETIME,

    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (LevelId) REFERENCES GameLevels(Id)
);

-- =============================
-- INDEXES
-- =============================
CREATE INDEX idx_user_email ON Users(Email);
CREATE INDEX idx_dictionary_word ON DictionaryEntries(Word);
CREATE INDEX idx_vocab_word ON Vocabulary(Word);
CREATE INDEX idx_game_user ON UserGameSession(UserId);
CREATE INDEX idx_progress_user ON UserProgress(UserId);
CREATE INDEX idx_lesson_level ON Lessons(LevelId);
CREATE INDEX idx_course_level ON Courses(LevelId);
CREATE INDEX idx_dictionary_level ON DictionaryEntries(LevelId);
CREATE INDEX idx_media_lesson ON LessonMedia(LessonId);

GO