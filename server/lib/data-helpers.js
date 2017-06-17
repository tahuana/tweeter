"use strict";
const ObjectID = require('mongodb').ObjectID;


// Defines helper functions for saving and getting tweets, using the MongoDB
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to db
    saveTweet: function(newTweet, callback) {

      db.collection("tweets").insertOne(newTweet, (err, result) => {
        if (err) {
          return callback(err);
        }

        callback(null, true);

      });

    },

    // Get all tweets in db, sorted by newest first
    getTweets: function(callback) {

      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }

        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));

      });

    },

    // Update the tweet
    //get the tweet ID and total of likes
    //update mongoDB using the ObjectID to find the correct tweet and update the total of likes with the value received
    updateTweet: function(tweet, callback) {

      let id = tweet["_id"];
      let likes = tweet["likes"];

      db.collection("tweets").updateOne({
          _id: ObjectID(id)
        }, {
          $set: {
            "likes": likes
          }
        }, (err, result) => {

        if (err) {
          return callback(err);
        }

        callback(null, true);

      });

    }

  }
}