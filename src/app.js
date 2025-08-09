const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const stockService = require('./services/stockService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', stockRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ETF Stock Backend API',
    endpoints: {
      stock: '/api/stock/:symbol?range=5y',
      health: '/api/health'
    },
    supportedSymbols: stockService.getSupportedSymbols(),
    examples: [
      '/api/stock/00919.TW?range=3d',
      '/api/stock/0050.TW?range=1mo', 
      '/api/stock/0056.TW?range=12mo'
    ]
  });
});

// Warmup cache on startup
async function initializeApp() {
  try {
    await stockService.warmupCache();
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error.message);
  }
}

module.exports = { app, initializeApp };