const cron = require('node-cron');
const logger = require('../utils/logger');
const { updateTickers } = require('../services/tickerService');
const { fetchAllDailyChartData } = require('../services/chartService');

function initializeChartDataScheduler() {
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Starting scheduled');
    await updateTickers();
    await fetchAllDailyChartData();
  });

  updateTickers();
  fetchAllDailyChartData();

  logger.info('Initialized scheduler');
}

module.exports = {
  initializeChartDataScheduler
};