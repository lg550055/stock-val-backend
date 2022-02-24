'use strict';

// module imports and instatiation
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

// connection validation
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Mongoose is connected');
});

const PORT = process.env.PORT;

const Stock = require('./models/stock');
const finInfo = require('./finfo');

// server routes
app.get('/', (req, res)=> res.send('Server here!'));
app.get('/stocks', getStocks);
app.post('/stocks', addStock);
app.delete('/stocks/:id', deleteStock);
app.get('/price', getPrice);

function getStocks (req, res) {
  Stock.find( req.query.ticker ? {ticker: req.query.ticker} : {})
    .then(stocks => res.status(200).send(stocks));
}

async function addStock (req, res) {
  try {
    const stock = await finInfo(req.query.ticker);
    const stockAdded = await Stock.create(stock);
    res.status(200).send(stockAdded);
  } catch (err) {
    res.status(500).send('Server '+err);
  }
}

function deleteStock (req, res) {
  Stock.findByIdAndDelete({ _id: req.params.id })
    .then(stock => res.send('deleted '+stock.ticker));
}

async function getPrice(req, res) {
  let ticker = req.query.ticker;
  let url = `https://finnhub.io/api/v1/quote?token=${process.env.PRICE_KEY}&symbol=${ticker}`;
  let p = await axios.get(url);
  res.send(`${p.data.c}`);
}

// catch-all route
app.get('*', (req, res) => {
  res.send('Endpoint not found, please check your intended url');
});

// activate server
app.listen(PORT, ()=> console.log('Server listening on '+PORT) );
