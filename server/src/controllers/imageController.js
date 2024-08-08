const imageService = require('../services/imageService');
const ChartImage = require('../models/ChartImage');
const logger = require('../utils/logger');

async function generateAllChartImages(req, res) {
  try {
    const result = await imageService.generateAllChartImages();

    if (result) {
      res.json({ 
        message: 'All chart images generated successfully', 
        totalDuration: result.totalDuration,
        totalImages: result.results.length
      });
    } else {
      res.status(500).json({ error: 'Failed to generate all chart images' });
    }
  } catch (error) {
    logger.error('Error in generateAllChartImages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function generateChartImage(req, res) {
  const { symbol } = req.params;

  try {
    const result = await imageService.processChartImageGeneration(symbol);
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    logger.error(`Error in generateChartImage for ${symbol}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function viewChart(req, res) {
  const { symbol } = req.params;
  
  try {
    const chartImage = await ChartImage.findOne({ symbol });
    if (chartImage && chartImage.imageData) {
      res.contentType('image/png');
      res.send(chartImage.imageData);
    } else {
      res.status(404).send('Chart image not found');
    }
  } catch (error) {
    logger.error(`Error in viewChart for ${symbol}:`, error);
    res.status(500).send('Internal Server Error');
  }
}

async function getChartList(req, res) {
  try {
    const chartImages = await ChartImage.find({}, 'symbol lastUpdated').sort('symbol');
    res.json(chartImages);
  } catch (error) {
    logger.error('Error in getChartList:', error);
    res.status(500).json({ error: 'Failed to fetch chart list' });
  }
}

module.exports = {
  generateAllChartImages,
  generateChartImage,
  viewChart,
  getChartList
};