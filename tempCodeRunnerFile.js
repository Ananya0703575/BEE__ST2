var bodyParser = require("body-parser");
var conn = require("./connect");
var mysql = require("mysql");
var express = require("express");
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();
app.set("view engine", "ejs");

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/landingPage.html");
});