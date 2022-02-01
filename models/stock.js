'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  ticker: { type: String, uppercase: true, trim: true },
  fy2022: {
    revenue: Number,
    ebitda: Number,
    capex: Number,
    cash: Number,
    debt: Number
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
