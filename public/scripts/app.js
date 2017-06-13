/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//function that takes in a tweet object
//and return a tweet <article> element containing the entire HTML structure of the tweet
function createTweetElement(tweetData) {

  //get how many days between today and the date when the tweet was created
  $date1 = new Date(1461116232227);
  $date2 = new Date();

  $timeDiff = Math.abs($date2.getTime() - $date1.getTime());
  $diffDays = Math.ceil($timeDiff / (1000 * 3600 * 24));

  //create the tweet html structure
  // $tweet = "<p>teste</p>"
  $tweet = (`<article>` +
              `<header>` +
                `<img src="${tweetData.user.avatars.small}">` +
                `<h2>${tweetData.user.name}</h2>` +
                `<span>${tweetData.user.handle}</span>` +
              `</header>` +
              `<div>${tweetData.content.text}</div>` +
              `<footer>` +
                `<span>${$diffDays} days ago</span>` +
                `<div class="options">` +
                  `<span><i class="fa fa-flag" aria-hidden="true"></i></span>` +
                  `<span><i class="fa fa-retweet" aria-hidden="true"></i></span>` +
                  `<span><i class="fa fa-heart" aria-hidden="true"></i></span>` +
                `</div>` +
              `</footer>` +
            `</article>`);

  //return the structure to append to html
  return $tweet;

}

//function that take in an array of tweet objects, call the createTweetElement function above,
//and use the returned jQuery object to append each one to the #tweets-container section
function renderTweets(tweets) {
  // loops through tweets
  for (let i = 0; i < tweets.length; i++) {

    // calls createTweetElement for each tweet
    $tweet = createTweetElement(tweets[i]);

    // takes return value and appends it to the tweets container
    $('#tweets-container').append($tweet);
  }

}

// Test / driver code (temporary). Eventually will get this from the server.
var data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


$(document).ready( function() {

  renderTweets(data);

});


