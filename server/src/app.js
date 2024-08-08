require('dotenv').config();
const route = require('./routes/route');
const logger = require('./utils/logger');
const express = require('express');
const connectDB = require('./config/database');
const performanceLogger = require('./middleware/performanceLogger');
const { initializeChartDataScheduler } = require('./scheduler/chart-data-scheduler');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(performanceLogger); 

app.use('/', route);

initializeChartDataScheduler();

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});