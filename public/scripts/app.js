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

  //clear the container before to read all tweets
  $("#tweets-container").empty();

  // loops through tweets from newer to older
  for (let i = (tweets.length - 1); i > 0 ; i--) {

    // calls createTweetElement for each tweet
    $tweet = createTweetElement(tweets[i]);

    // takes return value and appends it to the tweets container
    $('#tweets-container').append($tweet);
  }

}


$(document).ready( function() {

  //event listener to submit button
  $("#submit").on("click", function(event) {

    //prevent to change the page
    event.preventDefault();

    //get data from the form
    $textarea = $(this).closest("form").find("textarea");
    $message = $(this).closest("form").find("#message");

    //prepare data for Ajax calling
    $data = $textarea.serialize();

    //get the text (without spaces) and its lenght to validate
    $text = $textarea.val().trim();
    $textLength = $text.length;


    if ($text === "" || $text === null) {

      //if text is null, show a message for empty text
      $message.text("Your message is empty!").toggle(true);


    } else if ($textLength > 140) {

      //if text exceed 140 characters, show a message for too long text
      $message.text("Your message is too long!").toggle(true);

    } else {

      //validations are ok, tweet will be send, and show in the area for tweets
      $.ajax ({
        url:"/tweets/",
        contentType: "application/x-www-form-urlencoded",
        method: "POST",
        data: $data,
        success: function () {
          loadTweets();
        },
        error: function () {}
      });

      //hidden the message if it is shown, and clear the textarea
      $message.text("").toggle(false);
      $textarea.val("");
    }

  });

  //function that load tweets from db, and show on screen (call renderTweets function)
  function loadTweets () {

    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: function (tweets) {
          renderTweets(tweets);
          // console.log(tweets);
        },
      error: function () {}

    });
  };

  //start the app showing the tweets
  loadTweets();


});

