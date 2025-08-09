require('dotenv').config();

const { app, initializeApp } = require('./app');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize cache warmup
    await initializeApp();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`ETF Stock Backend server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Example: http://localhost:${PORT}/api/stock/00919.TW?range=3d`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();