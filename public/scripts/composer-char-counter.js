$(document).ready(function () {

  $(".new-tweet").on( "keyup", "textarea" , function(event) {
    //get the value of 'this', that mean, the text that user enter in a textarea
    //get the length of the text
    //subtract this value from 140.
    var text = $(this).val();
    var charsLeft = 140 - text.length;

    //go to parent elemtn (form) and find the respective counter
    //set the text to be equal the value calculated above
    var counter = $(this).closest("form").find(".counter")
    counter.text(charsLeft);

    //if the text exceed the 140 limit, that mean the variable charsLeft < 0,
    //add a class to the counter that change the font color to red
    //otherwise, remove that class to let the font color as original
    if (charsLeft < 0) {
      counter.addClass("fontRed");
    } else {
      counter.removeClass("fontRed");
    }



  });



});