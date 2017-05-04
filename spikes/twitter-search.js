const Twitter = require('twitter-node-client').Twitter;
const Promise = require('bluebird');

const Keys = require('../config').twitter;

const keys = {
  consumerKey: Keys.consumer_key,
  consumerSecret: Keys.consumer_secret,
  accessToken: Keys.access_token_key,
  accessTokenSecret: Keys.access_token_secret,
};

const twitter = new Twitter(keys);

/**
 * Helper function that loops through promises (getting tweets)
 * until the while condition evaluates to false.
 * @function
 * @param {function} condition - a function that evalutes to a boolean
 * @param {function} action - a promise function whose evaluation is looped
 */

const promiseWhile = (condition, action) => {
  const resolver = Promise.defer();

  const loop = () => {
    if (!condition()) return resolver.resolve();
    return Promise.cast(action())
      .then(loop)
      .catch(resolver.reject);
  };

  process.nextTick(loop);

  return resolver.promise;
};

/**
 * Get an array of tweet objects
 * @function
 * @param {string} query - Query string (e.g. '$AAPL' for apple stock ticker)
 * @param {string} startDate - earliest date of tweets to retrieve 'yyyy-mm-dd'
 * @param {string} endDate - latest date of tweets to retrieve 'yyyy-mm-dd'
 *                           Note: up to and *excluding* this date
 *                           For current tweets, use current date + 1 day
 * @param {integer} maxTweets - max number of tweets to retrieve
 * @param {function} callback - function that takes in the resulting tweetSet as
 *                              a parameter
 */


const getTweetSet = (query, startDate, endDate, maxTweets, callback) => {

  let tweetSet = [];
  let tweetCount = 0;
  let endOfResults = false;

  // Last tweet retrieved from current "page" of retrieved tweets
  // = the starting point for the next call to retrieve tweets
  let maxId = null;

  const condition = () => {
    let reachedStartDate = false;
    if (tweetSet.length > 0) {
      const start = new Date(startDate);
      const oldestTweetDate = new Date(tweetSet[tweetSet.length - 1].created_at);
      console.log(' reachedStartDate: ', oldestTweetDate < start, oldestTweetDate, start);
      reachedStartDate = oldestTweetDate < start;
    }
    console.log('Conditions: length ', tweetSet.length < maxTweets, ' | !endOfResults ', !endOfResults, ' | !reachedStartDate ', !reachedStartDate);
    return tweetSet.length < maxTweets && !endOfResults && !reachedStartDate;
  };

  promiseWhile(condition, () => {
    return new Promise((resolve, reject) => {
      let tweetsArray = [];

      const params = {
        q: query,
        until: endDate,
        count: 100,
      };

      if (maxId !== null) params.max_id = maxId;

      // Callback function for error case for twitter.getSearch
      const error = (err, response, body) => {
        console.log('ERROR');
        console.log(body);
        console.log('ERROR [%s]', err);
        endOfResults = true;
        reject([]);
      };

      // Callback function for success case for twitter.getSearch()
      // Retrieves maxium 100 tweets per query
      const success = (data) => {
        let tweets = JSON.parse(data);

        if (!Array.isArray(tweets) && tweets.statuses && Array.isArray(tweets.statuses)) {
          tweets = tweets.statuses;
        }

        if (Array.isArray(tweets)) {
          if (tweets.length === 0) {
            endOfResults = true;
          } else {
            tweetsArray = tweets.map((tweet) => {
              return {
                id: tweet.id,
                created_at: tweet.created_at,
                text: tweet.text,
              };
            });
            tweetSet = tweetSet.concat(tweetsArray);
            maxId = tweetsArray[tweetsArray.length - 1].id;
            tweetCount += tweetsArray.length;
          }
        } else {
          console.warn('**** Result type is not an array ****');
        }
        resolve(tweetsArray);
      };

      twitter.getSearch(params, error, success);
    });
  })
    .then(() => {
      callback(tweetSet);
    });
};

/**
 *  Example usage:
 */

getTweetSet('$AAPL', '2017-03-01', '2017-05-03', 200, (tweetSet) => {
  console.log('*** Tweets received *** [', tweetSet.length, ']');

  if (tweetSet.length > 0) {
    console.log('Most recent: ', tweetSet[0].created_at);
    console.log('Least recent: ', tweetSet[tweetSet.length - 1].created_at);
    console.log(tweetSet.slice(190));
  }
});
