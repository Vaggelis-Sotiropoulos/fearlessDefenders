const assert = require('assert');
const Score = require('../server/db/index');

describe('Reading users out of the database', () => {
  let aapl;

  beforeEach((done) => {
    aapl = new Score({ date: '2017-05-12', symbol: 'AAPL',  score: 0.735467 });
    aapl.save()
      .then(() => done());
  });

	it('finds all entries with a ticker of aapl', (done) => {
    Score.find({ symbol: 'AAPL' })
      .then((companies) => {
        assert(companies[0]._id.toString() === aapl._id.toString());
        done();
      });
  });

  it('find a ticker with a particular id', (done) => {
    Score.findOne({ _id: aapl._id })
      .then((company) => {
        assert(company.symbol === 'AAPL');
        done();
      })
  })
});