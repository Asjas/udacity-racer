require('make-promises-safe');
const compression = require('compression');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const fetch = require('node-fetch');
const helmet = require('helmet');
const morgan = require('morgan');
const { join } = require('path');

dotenv.config();
const { NODE_ENV } = process.env;

const app = express();

// In production we enable GZIP compression of requests
if (NODE_ENV === 'production') {
  app.use(compression());
}

// In development we enable request logging to the console
if (NODE_ENV === 'development') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// handle favicon requests as early as possible to avoid other Express middleware
app.use(favicon(join(__dirname, '../public/assets/', 'favicon.ico')));

// Since Express 4.16 the `urlencoded` and `json` methods were added to Express itself so there is no need for `bodyparser`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Add HTTP security headers to Express requests
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// setup the express assets path
app.use('/', express.static(join(__dirname, '../public')));

// API calls ------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
  res.sendFile(join(__dirname, '../public/client/pages/home.html'));
});

app.get('/race', async (req, res) => {
  res.sendFile(join(__dirname, '../public/client/pages/race.html'));
});

app.listen(process.env.PORT, () => console.log(`Server listening on http://localhost:${process.env.PORT} 🚀`));
