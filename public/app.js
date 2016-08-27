// grab the articles as a json
var articleArray = [];
var thisId
$.getJSON('/articles', function(data) {
    // for each one
    $('#notes').empty();
    $('#articles').empty();
    // $('#notes').empty();
    for (var i = 0; i < data.length; i++) {
          articleArray[i] = data[i]; 
        if (i == 0) {
          //  $('textarea#articles').val('<p data-id="' + data[i]._id + '">' + data[i].title + '<br />' + data[i].link + '</p>');

   $('#noteTitle').append('<p>' + "test" + '</p>'); 


            thisId = data[i]._id ;
          //  thisId = $(this).attr('data-id');


            $.ajax({
                method: "GET",
                url: "/articles/" + thisId,
            })
            

            .done(function(data) {
            console.log(JSON.stringify(data, null, 2));

$('#articles').append("<p> + data.title + </p>");
        //    $('textarea#articles').append(data.title + "\n" + data.link); 
        //    $('textarea#articles').append(data.link); //data.title ); 

              //  $('textarea#articles').val( "test");     //data.articles); 
             //   $('textarea#noteTitle').val(data.note.title); //data.title ); 
                if (data.note) {

           $('#noteTitle').append('<p>' + data.note.title + '</p>'); 


                    // place the title of the note in the title input
                //    $('#titleinput').val(data.note.title);
                    // place the body of the note in the body textarea
                 //   $('#bodyinput').val(data.note.body);
                }
            });

        }
    }

});


//     $('#articles').append('<p data-id="' + articleArray[0]._id + '">'+ articleArray[0].title + '<br />'+ articleArray[0].link + '</p>');



// whenever someone clicks a p tag
$(document).on('click', 'p', function() {


   // $('#notes').empty();

    // save the id from the p tag
    var thisId = $(this).attr('data-id');





    // now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId,
    })


    .done(function(data) {


        // the title of the article
        // $('#noteTitle').set('<p>' + data.title + '</p>'); 

        $('textarea#noteTitle').val("yep"); //data.title ); 

        // an input to enter a new title
        //  $('#noteTitle').set('<input id="titleinput" name="title" >'); 

        // a textarea to add a new note body
        $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
        // a button to submit a new note, with the id of the article saved to it
        $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

        // if there's a note in the article
        if (data.note) {
            // place the title of the note in the title input
            $('#titleinput').val(data.note.title);
            // place the body of the note in the body textarea
            $('#bodyinput').val(data.note.body);
        }
    });
});

// when you click the savenote button
$(document).on('click', '#savenote', function() {
    // grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id');

    // run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $('#titleinput').val(), // value taken from title input
                body: $('#bodyinput').val() // value taken from note textarea
            }
        })
        // with that done
        .done(function(data) {
            // log the response
            console.log(data);
            // empty the notes section
            $('#notes').empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $('#titleinput').val("");
    $('#bodyinput').val("");
});
