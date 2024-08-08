const vega = require('vega');
const vegalite = require('vega-lite');
const logger = require('../utils/logger');
const ChartImage = require('../models/ChartImage');
const DailyChart = require('../models/DailyChart');
const Ticker = require('../models/Ticker');

async function generateChartImage(data) {
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const isUp = prices.at(0) >= prices.at(-1);
  const chartColor = isUp ? '#ff5252' : '#0a7df3';

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 800,
    height: 400,
    data: { values: data },
    mark: {
      type: 'area',
      line: {
        color: chartColor,
        strokeWidth: 2
      },
      color: {
        x1: 1,
        y1: 1,
        x2: 1,
        y2: 0,
        gradient: 'linear',
        stops: [
          { offset: 0, color: "white" },
          { offset: 1, color: chartColor }
        ],
      },
    },
    encoding: {
      x: {
        field: 'time',
        type: 'temporal',
        axis: null
      },
      y: {
        field: 'price',
        type: 'quantitative',
        scale: {
          domain: [minPrice, maxPrice],
        },
        axis: null
      },
      y2: { datum: minPrice }
    },
    config: {
      view: {
        stroke: null
      },
      background: 'transparent',
      padding: { top: 12, bottom: 0, left: 0, right: 0 }
    }
  };

  const vegaSpec = vegalite.compile(spec).spec;
  const view = new vega.View(vega.parse(vegaSpec), { renderer: 'none' });
  const canvas = await view.toCanvas();
  return canvas.toBuffer();
}

async function saveChartImage(symbol, imageBuffer) {
  try {
    await ChartImage.findOneAndUpdate(
      { symbol: symbol },
      {
        symbol: symbol,
        imageData: imageBuffer,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    logger.error(`Error saving chart image for ${symbol}:`, error.message);
    return false;
  }
}

async function processChartImageGeneration(symbol) {
  try {
    const chartData = await DailyChart.findOne({ symbol });
    if (!chartData) {
      throw new Error(`No chart data found for symbol ${symbol}`);
    }

    const processedData = chartData.data.map(item => ({
      time: new Date(item.openTime),
      price: item.close
    }));

    const imageBuffer = await generateChartImage(processedData);
    if (!imageBuffer) {
      throw new Error(`Failed to generate chart image for ${symbol}`);
    }

    const saved = await saveChartImage(symbol, imageBuffer);
    if (!saved) {
      throw new Error(`Failed to save chart image for ${symbol}`);
    }

    return { success: true, message: `Chart image for ${symbol} generated and saved successfully` };
  } catch (error) {
    logger.error(`Error processing chart for ${symbol}:`, error);
    return { success: false, error: error.message };
  }
}

async function generateAllChartImages() {
  const startTime = Date.now();
  try {
    const tickers = await Ticker.find().sort('rank');
    const results = [];

    for (const ticker of tickers) {
      const result = await processChartImageGeneration(ticker.symbol);
      results.push({ symbol: ticker.symbol, ...result });
    }

    const endTime = Date.now();
    const totalDuration = (endTime - startTime) / 1000;

    return { results, totalDuration };
  } catch (error) {
    const endTime = Date.now();
    const totalDuration = (endTime - startTime) / 1000;
    logger.error(`Error generating all chart images (duration: ${totalDuration.toFixed(2)} seconds):`, error.message);
    return null;
  }
}

module.exports = {
  generateAllChartImages,
  processChartImageGeneration
};