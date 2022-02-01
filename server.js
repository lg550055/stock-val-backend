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

function getStocks (req, res) {
  Stock.find( req.query.ticker ? {ticker: req.query.ticker} : {})
    .then((stocks) => res.send(stocks));
}

function deleteStock (req, res) {
  Stock.findByIdAndDelete({ _id: req.params.id })
    .then((stock) => res.status(200).send('deleted '+stock.ticker));
}

app.get('*', (req, res) => {
  res.status(404).send('Endpoint not found, please check your intended url');
});

app.listen(PORT, ()=> console.log('Server listening on '+PORT) );
