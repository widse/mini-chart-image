const mongoose = require('mongoose');

const chartImageSchema = new mongoose.Schema({
  symbol: String,
  imageData: Buffer,
  lastUpdated: Date
});

module.exports = mongoose.model('ChartImage', chartImageSchema);