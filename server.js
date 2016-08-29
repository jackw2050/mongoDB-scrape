//  /  	- scrape stories
//  	- save to db
//	users can leave comments and remove comments 
//	link to articles
//	comments saved to db
var express = require('express'); //1
var app = express();
var bodyParser = require('body-parser');//4
var logger = require('morgan');
var mongoose = require('mongoose');//3
var request = require('request');//6
var cheerio = require('cheerio');//5


// add express-handlebars  // 2

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// make public a static dir
app.use(express.static('public'));

//mongo ds017736.mlab.com:17736/heroku_42cbbl7z -u jack -p jack
// Database configuration with mongoose
mongoose.connect('mongodb://localhost/week18day3mongoose');
//mongoose.connect('mongodb://jack:jack@ds017736.mlab.com:17736/heroku_42cbbl7z');
//mongoose.connect('mongodb://jack:jack@ds017736.mlab.com:17736/heroku_42cbbl7z');

var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
    console.log('Mongoose connection successful.');
});


var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


app.get('/', function(req, res) {
    res.send(index.html);
});

app.get('/scrape', function(req, res) {
    request('http://www.japantimes.co.jp/', function(error, response, html) {
        //  request('http://www.echojs.com/', function(error, response, html) {
        var $ = cheerio.load(html);
        //  $('article h2').each(function(i, element) {
        $('article h1').each(function(i, element) {
            var result = {};


            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            var entry = new Article(result);

            // now, save that entry to the db
            entry.save(function(err, doc) {
                // log any errors
                if (err) {
                    console.log(err);
                }
                // or log the doc
                else {
                    console.log(doc);
                }
            });


        });
    });
    res.send("Scrape Complete");
});

app.get('/articles', function(req, res) {
    Article.find({}, function(err, doc) {
        // log any errors
        if (err) {
            console.log(err);
        }
        else {
            res.json(doc);
        }
    });
});

app.get('/articles/:id', function(req, res) {
    Article.findOne({ '_id': req.params.id })
        .populate('note')
        .exec(function(err, doc) {
            // log any errors
            if (err) {
                console.log(err);
            }
            else {
                res.json(doc);
            }
        });
});


app.post('/articles/:id', function(req, res) {
    var newNote = new Note(req.body);

    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {

            Article.findOneAndUpdate({ '_id': req.params.id }, { 'note': doc._id })
                // execute the above query
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});







// listen on port 3000
app.listen(3000, function() {
    console.log('App running on port 3000!');
});
