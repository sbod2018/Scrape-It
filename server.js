var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require all models
var db = require("./models");

var PORT = 3000;

//  intiialize express
var app = express();

// use morgan logger for logging request
app.use(logger("dev"));
// parse request body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static("public"));

// connect to the mongo db
mongoose.connect("");

// a get route for scraping the reddit website
app.get("/scrape", function(req, res){
    // first grab the body of the html with axios
    axios.get("https://old.reddit.com/r/webdev/").then(function(response){
        // then load that into cheerio and save it to $ for a shorthand selector  
        var $ = cheerio.load(response.data);

        // now grab every h2 within an article tag, and do the following
        $("article h2").each(function(i, element){
            // save an empty result object 
            var results = {};
            
            // add text and href of every link, and save them as properties of the result object
            results.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            // create new Article using the 'result' object built from scraping
            db.Article.create(result)
            .then(function(dbArticle){
                // view the added result in the console 
                console.log(dbArticle);
            })
            .catch(function(err){
                // if an error occurred, send it to the client
                return res.json(err);
            });
        });

        // if we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
         });
    });

    // route for gettinf all Articles from db
    app.get("/articles", function(req, res){
        // grab every document in the Articles collection
        db.Article.find({})
        .then(function(dbArticle){
            // if able to successfully find Articles, send back to client
            res.jsonc(dbArticle);
        })
        .catch(function(err){
            // if an error occurred, send to client
            res.json(err);
        });
    });

    // route for grabbing a specific Article by id, populate with it's note
    app.get("/articles/:id", function(req, res){
        // using the id passed in the id paramter, prepare a query that finds the matching one in db
        db.Article.findOne({_id: req.params.id})
        // populate all of the notes associated with it 
        .popualate ("note")
        .then(function(dbArticle){
            // if we were able to successfully find an Article with the given id, send back to client
            res.json(dbArticle);
        })
        .catch(function(err){
            // if error occurred, send to client 
            res.json(err);
        });
    });

    // route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res){
        // create a new note and pass the req.body to the entry
        db.Note.create(req.body)
        .then(function(dbNote){
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
        })
        .then(function(dbArticle){
            // if we were able to successfully update an Article, send back to client
            res.json(dbArticle);
        })
        .catch(function(err){
        // if error occurred, sent it to the client
        res.json(err);
        });
    });

    // start server
    app.listen(PORT, function(){
        console.log(`App running on port ${PORT}!`);
    })