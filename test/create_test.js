const assert = require('assert');
const Score = require('../server/db/index');

describe('Creates new Score instance', () => {
  it('saves a new Score collection', (done) => {
    const aapl = new Score({ date: '2017-05-12', symbol: 'AAPL',  score: 0.735467 });

    aapl.save()
    	.then(() => {
	      assert(!aapl.isNew);
        console.log('new instance')
	      done();
      });
  });
});