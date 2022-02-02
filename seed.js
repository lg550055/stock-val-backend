'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Stock = require('./models/stock');

async function seed () {
  await Stock.create({
    ticker: 'T',
    fy2021: {
      revenue: 100,
      ebitda: 20,
      capex: 9,
      cash: 10,
      debt: 50,
      shares: 100
    }
  });

  await Stock.create({
    ticker: 'FAKE',
    price: 22,
    priceDate: Date.now(),
    fy2021: {
      revenue: 100,
      ebitda: 20,
      capex: 9,
      cash: 10,
      debt: 50,
      shares: 100
    }
  });

  mongoose.disconnect();
}

seed();
