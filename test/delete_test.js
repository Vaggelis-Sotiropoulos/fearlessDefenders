const assert = require('assert');
const Score = require('../server/db/index');

describe('Deleting a company', () => {
	let aapl;

  beforeEach((done) => {
    aapl = new Score({ date: '2017-05-12', symbol: 'AAPL',  score: 0.735467 });
    aapl.save()
      .then(() => done());
  });

  it('Score instance remove', (done) => {
    aapl.remove()
      .then(() => Score.findOne({ symbol: 'AAPL' }))
      .then((company) => {
        assert(company === null);
        done();
      });
  });

  it('Score method remove', (done) => {
    // Remove a bunch of records with some given criteria
    Score.remove({ symbol: 'AAPL' })
      .then(() => Score.findOne({ symbol: 'AAPL' }))
      .then((company) => {
        assert(company === null);
        done();
      });
  });

  it('Score method findOneAndRemove', (done) => {
    Score.findOneAndRemove({ symbol: 'AAPL' })
      .then(() => Score.findOne({ symbol: 'AAPL' }))
      .then((company) => {
        assert(company === null);
        done();
      });
  });

  it('Score method findByIdAndRemove', (done) => {
    Score.findByIdAndRemove(aapl._id)
      .then(() => Score.findOne({ symbol: 'AAPL' }))
      .then((company) => {
        assert(company === null);
        done();
      });
  });
})