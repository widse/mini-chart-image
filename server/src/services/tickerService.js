const axios = require('axios');
const logger = require('../utils/logger');
const Ticker = require('../models/Ticker');

async function fetchTop100ByMarketCap() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');

    const usdtPairs = response.data.filter(ticker => ticker.symbol.endsWith('USDT'));

    const pairsWithMarketCap = usdtPairs.map(ticker => ({
      ...ticker,
      approximateMarketCap: parseFloat(ticker.weightedAvgPrice) * parseFloat(ticker.quoteVolume)
    }));

    const sortedByMarketCap = pairsWithMarketCap.sort((a, b) =>
      b.approximateMarketCap - a.approximateMarketCap
    );

    const top100 = sortedByMarketCap.slice(0, 100);

    const currentTime = new Date();

    return top100.map((ticker, index) => ({
      rank: index + 1,
      symbol: ticker.symbol,
      lastPrice: parseFloat(ticker.lastPrice),
      volume: parseFloat(ticker.volume),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      approximateMarketCap: ticker.approximateMarketCap,
      timestamp: currentTime
    }));
  } catch (error) {
    logger.error('Error fetching top tickers:', error.message);
    return null;
  }
}

async function saveTickersToDatabase(tickers) {
  try {
    await Ticker.deleteMany({});
    await Ticker.insertMany(tickers);
  } catch (error) {
    logger.error('Error saving tickers to database:', error.message);
  }
}

async function updateTickers() {
  try {
    const topTickers = await fetchTop100ByMarketCap();
    if (topTickers) {
      await saveTickersToDatabase(topTickers);
      logger.info('Tickers updated successfully');
    } else {
      logger.error('Failed to fetch and update tickers');
    }
  } catch (error) {
    logger.error('Error updating tickers:', error);
  }
}

module.exports = {
  updateTickers
};