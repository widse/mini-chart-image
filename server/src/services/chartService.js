const axios = require('axios');
const logger = require('../utils/logger');
const Ticker = require('../models/Ticker');
const DailyChart = require('../models/DailyChart');

async function fetchDailyChartDataForSymbol(symbol) {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: symbol,
        interval: '5m',
        limit: 288 // 24 hours
      }
    });

    const chartData = {
      symbol: symbol,
      data: response.data.map(candle => ({
        openTime: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
        closeTime: candle[6]
      })),
      lastUpdated: new Date()
    };

    await DailyChart.findOneAndUpdate(
      { symbol: symbol },
      chartData,
      { upsert: true, new: true }
    );

    return chartData;
  } catch (error) {
    logger.error(`Error fetching chart data for ${symbol}:`, error.message);
    return null;
  }
}

async function fetchAllDailyChartData() {
  try {
    const tickers = await Ticker.find().sort('rank').limit(100);
    const chartDataPromises = tickers.map(ticker => fetchDailyChartDataForSymbol(ticker.symbol));
    await Promise.all(chartDataPromises);
    logger.info("DailyChart updated successfully")
    return true;
  } catch (error) {
    logger.error('Error fetching all chart data:', error.message);
    return false;
  }
}

module.exports = {
  fetchDailyChartDataForSymbol,
  fetchAllDailyChartData
};