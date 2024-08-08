const Ticker = require('../models/Ticker');
const ChartImage = require('../models/ChartImage');

async function getMarketCapCoins(req, res) {
    try {
        const tickers = await Ticker.find().sort('-approximateMarketCap').limit(100);
        
        const coinsWithImages = await Promise.all(tickers.map(async (ticker) => {
            const chartImage = await ChartImage.findOne({ symbol: ticker.symbol });
            return {
                symbol: ticker.symbol,
                miniChartImage: chartImage ? `/view-chart/${ticker.symbol}?${new Date().getTime()}` : null,
                lastPrice: ticker.lastPrice,
                volume: ticker.volume,
                priceChangePercent: ticker.priceChangePercent,
                approximateMarketCap: ticker.approximateMarketCap
            };
        }));

        res.json(coinsWithImages);
    } catch (error) {
        console.error('Error fetching market cap coins:', error);
        res.status(500).json({ error: 'Failed to fetch market cap coins' });
    }
}

module.exports = {
  getMarketCapCoins
};