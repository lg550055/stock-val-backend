'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  ticker: String,
  endDate: Date,
  shares: Number,
  cash: Number,
  debt: Number,
  annual: [{
    fy: Number,
    endDate: Date,
    rev: Number,
    ebit: Number,
    da: Number,
    cfo: Number,
    capex: Number,
  }]
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
