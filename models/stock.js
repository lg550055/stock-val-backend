'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  ticker: { type: String, trim: true },
  endDate: Date,
  shares: Number,
  cash: Number,
  debt: Number,
  kItems: [{
    endDate: Date,
    revenue: Number,
    gprofit: Number,
    ebitda: Number,
    cfo: Number,
    capex: Number,
  }]
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
