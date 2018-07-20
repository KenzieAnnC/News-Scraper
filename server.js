// Dependencies
var express = require("express");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");

// Initialize Express
var app = express();

var MONGODB_URI = process.env.MONGODB_URI || 3000;

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var db = require("./models");

var PORT = 3000;

app.get("/scrape", function (req, res) {
   
    axios.get("https://www.theonion.com/").then(function (response) {
        
        var $ = cheerio.load(response.data);

        $("h1").each(function (i, element) {
          
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("a")
                .text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    
                    console.log(dbArticle);
                })
                .catch(function (err) {
                  
                    return res.json(err);
                });
        });
  
        res.send("Scrape Complete");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete('/articles/:id', function (req, res) {
    db.Note.deleteOne(req.body)
        .then(function(dbNote) {
          return dbArticle.findOneAndUpdate({_id: req.params.id}, {note: dbNote}, {new: true});
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});