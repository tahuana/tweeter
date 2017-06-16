/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//function that takes in a tweet object
//and return a tweet <article> element containing the entire HTML structure of the tweet
const createTweetElement = (tweetData) => {

  //get how many days between today and the date when the tweet was created
  $dateCreated = new Date(tweetData.created_at);
  $dateToday = new Date();

  $timeDiff = Math.abs($dateToday.getTime() - $dateCreated.getTime());
  $diffDays = Math.ceil($timeDiff / (1000 * 3600 * 24));

  //create the tweet html structure
  // $tweet = "<p>teste</p>"
  $tweet = (`<article>` +
              `<header>` +
                `<img src="${tweetData.user.avatars.small}">` +
                `<h2>${tweetData.user.name}</h2>` +
                `<span>${tweetData.user.handle}</span>` +
              `</header>` +
              `<div class="body">${tweetData.content.text}</div>` +
              `<footer>` +
                `<span class="daysAgo">${$diffDays} days ago</span>` +
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
const renderTweets = (tweets) => {

  //clear the container before to read all tweets
  $("#tweets-container").empty();

  // loops through tweets from newer to older
  for (let i in tweets) {

    // calls createTweetElement for each tweet
    $tweet = createTweetElement(tweets[i]);

    // takes return value and appends it to the tweets container
    $('#tweets-container').prepend($tweet);
  }

}


$(document).ready( function() {

  //let the textarea enable automatically when load the page
  $(".new-tweet").find("textarea").focus();

  //event listener to toggle the new-tweetsection and enable the textarea
  $("#composeButton").on("click", function(event) {
    $(".new-tweet").slideToggle( "slow" );
    $(".new-tweet").find("textarea").focus();
  });


  //event listener to submit button
  $("#submit").on("click", function(event) {

    //prevent to change the page
    event.preventDefault();

    //get data from the form
    $textarea = $(this).closest("form").find("textarea");
    $message = $(this).closest("form").find("#message");
    $counter = $(this).closest("form").find(".counter");

    //prepare data for Ajax calling
    $data = $textarea.serialize();

    //get the text (without spaces) and its lenght to validate
    $text = $textarea.val().trim();
    $textLength = $text.length;


    if ($text === "" || $text === null) {

      //if text is null, show a message for empty text
      $message.text("Your message is empty!").toggle(true);
      $textarea.focus();

    } else if ($textLength > 140) {

      //if text exceed 140 characters, show a message for too long text
      $message.text("Your message is too long!").toggle(true);
      $textarea.focus();

    } else {

      //validations are ok, tweet will be send, and show in the area for tweets
      $.post("/tweets/", $data)
        .done(function () {
                loadTweets();
              });

      //hidden the message if it is shown, clear the textarea, and reset the char-counter
      $message.text("").toggle(false);
      $textarea.val("").focus();
      $counter.text("140");
    }

  });

  //function that load tweets from db, and show on screen (call renderTweets function)
  const loadTweets = () => {

    $.getJSON("/tweets")
      .done(function (tweets) {
              renderTweets(tweets);
            });

  };

  //start the app showing the tweets
  loadTweets();


});

