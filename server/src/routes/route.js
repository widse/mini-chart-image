const express = require('express');
const router = express.Router();

const tickerController = require('../controllers/tickerController');
const chartController = require('../controllers/chartController');
const imageController = require('../controllers/imageController');
const marketCapCoinsController = require('../controllers/marketCapCoinsController');

/**
 * ticker routes
 */
router.get('/update-tickers', tickerController.updateTickers);
router.get('/top100', tickerController.getTop100);

/**
 * Chart data routes
 */
router.get('/update-daily-charts', chartController.updateDailyCharts);
router.get('/daily-charts', chartController.getAllDailyCharts);
router.get('/daily-chart/:symbol', chartController.getDailyChart);

/**
 * Chart image routes
 */
router.get('/generate-all-chart-images', imageController.generateAllChartImages);
router.get('/generate-chart-image/:symbol', imageController.generateChartImage);
router.get('/view-chart/:symbol', imageController.viewChart);
router.get('/chart-list', imageController.getChartList);

/**
 * Market Cap Coins route
 */
router.get('/market-cap-coins', marketCapCoinsController.getMarketCapCoins);

module.exports = router;