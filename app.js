//Configuration file for UBSafe Backend

var express = require('express'); //import express
var app = express();
var db = require('./db');

var UserController = require('./controllers/UserController');
var RecommendationController = require('./controllers/RecommendationController');
app.use('/', UserController);
app.use('/', RecommendationController);

//makes app object visible to the rest of the program
//when we call for it using require()
module.exports = app;
