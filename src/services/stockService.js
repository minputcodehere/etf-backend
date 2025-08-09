const axios = require('axios');
const NodeCache = require('node-cache');

const STOCK_SYMBOLS = ['0056.TW', '00878.TW', '00919.TW', '0050.TW', '006208.TW'];

class StockService {
  constructor() {
    this.baseURL = 'https://query1.finance.yahoo.com/v8/finance/chart';
    this.cache = new NodeCache({ stdTTL: 30 }); // 30秒 TTL
  }

  async fetchStockData(symbol, range) {
    const cacheKey = `${symbol}_${range}`;
    
    // Check cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const url = `${this.baseURL}/${symbol}?interval=1d&range=${range}`;
      const response = await axios.get(url);
      
      if (response.data && response.data.chart && response.data.chart.result) {
        const data = response.data.chart.result[0];
        
        // Store in cache
        this.cache.set(cacheKey, data);
        
        return data;
      } else {
        throw new Error(`No data found for symbol: ${symbol}`);
      }
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error.message);
      throw error;
    }
  }

  async warmupCache() {
    console.log('Starting cache warmup...');
    const warmupPromises = STOCK_SYMBOLS.map(symbol => 
      this.fetchStockData(symbol, '1y').catch(error => {
        console.error(`Warmup failed for ${symbol}:`, error.message);
      })
    );

    await Promise.allSettled(warmupPromises);
    console.log('Cache warmup completed');
  }

  async getStockData(symbol, range) {
    return await this.fetchStockData(symbol, range);
  }

  getSupportedSymbols() {
    return STOCK_SYMBOLS;
  }
}

module.exports = new StockService();