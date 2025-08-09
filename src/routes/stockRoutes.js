const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

// Single endpoint for stock data
router.get('/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { range = '1y' } = req.query;

    // Validate symbol format (should end with .TW)
    if (!symbol.includes('.TW')) {
      return res.status(400).json({
        error: 'Invalid symbol format. Symbol should end with .TW (e.g., 0050.TW)'
      });
    }

    const data = await stockService.getStockData(symbol, range);
    
    res.json({
      success: true,
      symbol,
      range,
      data
    });
  } catch (error) {
    console.error('Stock route error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: `Failed to fetch data for ${req.params.symbol}`
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  const supportedSymbols = stockService.getSupportedSymbols();
  res.json({
    status: 'healthy',
    supportedSymbols,
    cacheInfo: 'TTL: 30 seconds'
  });
});

module.exports = router;