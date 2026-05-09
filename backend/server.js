// ============================================
// English Learning System — Server Entry Point
// ============================================
require('dotenv').config();
const { connectDB } = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to SQL Server
    await connectDB();
    console.log('✅ Connected to SQL Server database');

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  const { closeDB } = require('./src/config/database');
  await closeDB();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
