const mongoose = require('mongoose');

const tickerSchema = new mongoose.Schema({
  rank: Number,
  symbol: String,
  lastPrice: Number,
  volume: Number,
  priceChangePercent: Number,
  approximateMarketCap: Number,
  timestamp: Date
});

module.exports = mongoose.model('Ticker', tickerSchema);