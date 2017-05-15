const mongoose = require('mongoose');

const config = require('../../config');

mongoose.Promise = global.Promise;

mongoose.connect(config.databaseUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to mongodb'); //eslint-disable-line
});

const scoreSchema = mongoose.Schema({
  date: String,
  symbol: String,
  score: Number,
});

const Score = mongoose.model('score', scoreSchema);

module.exports = Score;
