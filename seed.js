'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const finInfo = require('./finfo');
const Stock = require('./models/stock');

async function seed (symbol) {

  const ob = await finInfo(symbol);

  await Stock.create(ob);

  mongoose.disconnect();
}

seed('HON');
