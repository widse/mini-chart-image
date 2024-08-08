const mongoose = require('mongoose');

const dailyChartSchema = new mongoose.Schema({
  symbol: String,
  data: [{
    openTime: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    closeTime: Number
  }],
  lastUpdated: Date
});

module.exports = mongoose.model('DailyChart', dailyChartSchema);