// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");

// Initialize Express
var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);