'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

// connection validation
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Mongoose is connected');
});

const PORT = process.env.PORT;

app.get('/', (req, res)=> res.send('Server here!'));

const Stock = require('./models/stock');

app.get('/stocks', getStocks);
app.delete('/stocks/:id', deleteStock);
app.get('/price', getPrice);

function getStocks (req, res) {
  Stock.find( req.query.ticker ? {ticker: req.query.ticker} : {})
    .then((stocks) => res.send(stocks));
}

function deleteStock (req, res) {
  Stock.findByIdAndDelete({ _id: req.params.id })
    .then((stock) => res.send('deleted '+stock.ticker));
}

const axios = require('axios');
function getPrice(req, res) {
  let ticker = req.query.ticker;
  let url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.PRICE_KEY}`;
  axios.get(url)
    .then((pData) => res.send(`${pData.data.results[0].c}`));
}

app.get('*', (req, res) => {
  res.send('Endpoint not found, please check your intended url');
});

app.listen(PORT, ()=> console.log('Server listening on '+PORT) );
