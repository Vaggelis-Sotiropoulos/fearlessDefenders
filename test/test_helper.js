const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
  mongoose.createConnection('mongodb://localhost/scores_test')
    .once('open', () => { done(); })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});



beforeEach((done) => {
  mongoose.connection.collections.scores.drop(() => {
    // Ready to run the next test!
    done();
  });
});