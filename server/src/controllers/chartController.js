const chartService = require('../services/chartService');
const DailyChart = require('../models/DailyChart');
const logger = require('../utils/logger');

async function updateDailyCharts(req, res) {
  try {
    const success = await chartService.fetchAllDailyChartData();
    if (success) {
      res.json({ message: 'All daily chart data updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to update daily chart data' });
    }
  } catch (error) {
    logger.error('Error in updateDailyCharts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAllDailyCharts(req, res) {
  try {
    const allChartData = await DailyChart.find();
    res.json(allChartData);
  } catch (error) {
    logger.error('Error in getAllDailyCharts:', error);
    res.status(500).json({ error: 'Failed to fetch chart data from database' });
  }
}

async function getDailyChart(req, res) {
  const { symbol } = req.params;
  try {
    const chartData = await DailyChart.findOne({ symbol: symbol });
    if (chartData) {
      res.json(chartData);
    } else {
      res.status(404).json({ error: `Chart data not found for ${symbol}` });
    }
  } catch (error) {
    logger.error(`Error in getDailyChart for ${symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch chart data for ${symbol}` });
  }
}

module.exports = {
  updateDailyCharts,
  getAllDailyCharts,
  getDailyChart
};