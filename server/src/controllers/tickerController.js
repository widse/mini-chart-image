const tickerService = require('../services/tickerService');
const Ticker = require('../models/Ticker');

async function updateTickers(req, res) {
  try{
    await tickerService.updateTickers();
    res.json({ message: 'Tickers updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch and update tickers' });
  }
}

async function getTop100(req, res) {
  try {
    const tickers = await Ticker.find().sort('rank');
    res.json(tickers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickers from database' });
  }
}

module.exports = {
  updateTickers,
  getTop100
};