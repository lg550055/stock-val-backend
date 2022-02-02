'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  ticker: { type: String, uppercase: true, trim: true },
  price: Number,
  priceDate: Date,
  fy2021: {
    revenue: Number,
    ebitda: Number,
    capex: Number,
    cash: Number,
    debt: Number,
    shares: Number
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
