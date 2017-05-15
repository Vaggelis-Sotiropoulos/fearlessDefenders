const assert = require('assert');
const Score = require('../server/db/index');

describe('Updating company info', () => {
	let appl;

  beforeEach((done) => {
    aapl = new Score({ date: '2017-05-12', symbol: 'AAPL',  score: 0.735467 });
    aapl.save()
      .then(() => done());
  });

  function assertName(operation, done) {
    operation
      .then(() => Score.find({}))
      .then((companies) => {
        assert(companies.length === 1);
        assert(companies[0].score === 0.1);
        console.log(companies[0].score);
        done();
      });
  }

  it('instance type using set n save', (done) => {
    aapl.set('score', 0.1);
    console.log('set n save');
    assertName(aapl.save(), done);
      
  });

  it('Score instance can update', (done) => {
    console.log('Model instance update')
    assertName(aapl.update({ score: 0.1 }), done);
  });

  it('Score class can update', (done) => {
    assertName(
      Score.update({ score: 0.735467 }, { score: 0.1 }),
      done
    );
  });

});;
