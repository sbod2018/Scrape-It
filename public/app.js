// grab the articles as a json
$.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++){
        // display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

// whenever somone clicks a p tag
$(document).on("click", "p", function(){
    // empty the notes from the note section
    $("#notes").empty();
    // save the id from the p tag 
    var thisId = $(this).attr("data-Id");

    // now make an ajax call for the Article
    $.ajax({
        method: "GET", 
        url: "/articles/" + thisId
    })
    // with that done, add the note information to the page 
    .then(function(data){
        console.log(data);
        // the title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // input to enter new title
        $("#notes").append("<iput id='titleinput' name='title' >");
        // textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea");
        // a button to submit a new note, with the id og the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // if there's a note in the article
        if (data.note){
            // place the of the note in the title input
            $("#titleinput").val(data.note.title);
            //  place body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});

// when you click the savenote button
$(document).on("click", "#savenote", function(){
    // grab the id associated woth the article from the submit button
    var thisId = $(this).attr("data-id");

    // run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST", 
        url: "/articles/" + thisId,
        data: {
            // value taken from title input
            title: $("#bodyinput").val()
        }
    })
    // with that done
    .then(function(data){
        console.log(data);
        // empty the notes section
        $("#notes").empty();
    });

    // also remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});