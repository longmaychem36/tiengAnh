const sql = require('mssql/msnodesqlv8');
const dbConfig = {
  connectionString: `Driver={SQL Server};Server=localhost\\SQLEXPRESS;Database=EnglishLearningSystem;Trusted_Connection=yes;`
};

async function runMigration() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connected. Running migration...');
    
    // Create UserCollections
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserCollections' and xtype='U')
      CREATE TABLE UserCollections (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        UserId UNIQUEIDENTIFIER NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id)
      )
    `);

    // Create UserCollectionWords
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserCollectionWords' and xtype='U')
      CREATE TABLE UserCollectionWords (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        CollectionId UNIQUEIDENTIFIER NOT NULL,
        DictionaryEntryId UNIQUEIDENTIFIER NULL,
        CustomWord NVARCHAR(255) NULL,
        CustomMeaning NVARCHAR(MAX) NULL,
        CustomExample NVARCHAR(MAX) NULL,
        AddedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (CollectionId) REFERENCES UserCollections(Id) ON DELETE CASCADE,
        FOREIGN KEY (DictionaryEntryId) REFERENCES DictionaryEntries(Id) ON DELETE NO ACTION
      )
    `);

    console.log('Migration successful.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
