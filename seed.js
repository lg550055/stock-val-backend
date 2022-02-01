'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Stock = require('./models/stock');

async function seed () {
  await Stock.create({
    ticker: ' FakeSp  ',
    fy2022: {
      revenue: 100,
      ebitda: 20,
      capex: 9,
      cash: 10,
      debt: 50
    }
  });
  mongoose.disconnect();
}

seed();
