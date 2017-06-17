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

  //define the class of the heart image
  //if the tweet was not liked yet, the heart should be black with hover blue (class = heart)
  //if the tweet was already liked, the colors should be the opposite (blue with hover black => class = heartLiked)
  $alreadyLiked = tweetData.likes;

  if ($alreadyLiked == 0) {
    $class = "heart";
  } else {
    $class = "heartLiked";
  }

  //create the structure of tweet to be included in the html
  $tweet = (`<article>` +
              `<header>` +
                `<img src="${tweetData.user.avatars.small}">` +
                `<h2>${tweetData.user.name}</h2>` +
                `<span>${tweetData.user.handle}</span>` +
              `</header>` +
              `<div class="body">${tweetData.content.text}</div>` +
              `<footer>` +
                `<span class="daysAgo">${$diffDays} days ago</span>` +
                `<span class="likes" data-id="${tweetData._id}" data-total-of-likes="${tweetData.likes}"><b>Likes: ${tweetData.likes}</b></span>` +
                `<div class="options">` +
                  `<span><i class="fa fa-flag" aria-hidden="true"></i></span>` +
                  `<span><i class="fa fa-retweet" aria-hidden="true"></i></span>` +
                  `<span class="${$class}"><i class="fa fa-heart" aria-hidden="true"></i></span>` +
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


  //event listener to deal with the like button
  $("#tweets-container").on("click", ".fa-heart", function(event) {

    //get the tweet ID and the total of likes
    //this information come from database and was included as html data attribute when the html structure was created (function createTweetElement)
    //if the user doesn't like it yet, total = 0, otherwise total = 1
    $tweetID = $(this).closest("footer").find(".likes").data("id");
    $totalOfLikes = $(this).closest("footer").find(".likes").data("total-of-likes");

    if ($totalOfLikes === 0){
    //if total of likes = 0, means that the user doesn't like it yet
    //increment the total like, send a PUT to update the database
    //and reload the tweets to update the screen with the liking information

      $data = { _id: $tweetID, likes: ($totalOfLikes + 1) }

      $.ajax({
        method: "PUT",
        url: "/tweets/edit",
        data: $data
      })
        .done(function() {
          loadTweets();
        });

    } else {
    //if total of likes = 1, means that the user have already liked it
    //decrement the total like, send a PUT to update the database
    //and reload the tweets to update the screen with the liking information

      $data = { _id: $tweetID, likes: ($totalOfLikes - 1) }

      $.ajax({
        method: "PUT",
        url: "/tweets/edit",
        data: $data
      })
        .done(function() {
          loadTweets();
        });
    }

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

