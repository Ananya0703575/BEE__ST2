var bodyParser = require("body-parser");
var conn = require("./connect");
var mysql = require("mysql");
var express = require("express");
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();

app.engine("ejs", require("ejs").renderFile);

app.set("view engine", "ejs");

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (request, response) {
  var result = "welcome to landing page";
  response.render("landingPage", { result: result });
});

app.get("/signup", function (request, response) {
  response.render("signup");
});
app.get("/login", function (request, response) {
  response.render("login");
});
app.get("/admin", function (request, response) {
  conn.connect(function (error) {
    var sql = "SELECT * FROM userinfo";

    conn.query(sql, function (error, result) {
      response.render("admin", { result: result });
    });
  });
});

app.get("/homepage", function (request, response) {
  var username = request.query.username;
  conn.connect(function (error) {
    var sql =
      "SELECT * FROM userinfo WHERE username =" + mysql.escape(username);

    conn.query(sql, function (error, result) {
      response.render("homepage", { result: result });
    });
  });
});

app.get("/Profilepath", function (request, response) {
  var username = request.query.username;
  conn.connect(function (error) {
    var sql =
      "SELECT * FROM userinfo WHERE username =" + mysql.escape(username);

    conn.query(sql, function (error, result) {
      console.log(username);
      response.render("Profile", { result: result });
    });
  });
});

app.get("/changePass", function (request, response) {
  var username = request.query.username;
  conn.connect(function (error) {
    var sql =
      "SELECT * FROM userinfo WHERE username =" + mysql.escape(username);

    conn.query(sql, function (error, result) {
      response.render("changePass", { result: result });
    });
  });
});

app.get("/logout", function (request, response) {
  var res = "logged out Successfully";
  response.render("landingPage", { result: res });
});

app.post("/passchange", function (request, response) {
  var username = request.body.username;
  var oldPass = request.body.oldpassword;
  var newPass = request.body.newpassword;

  conn.connect(function (error) {
    var sql =
      "UPDATE userinfo  SET password = " +
      mysql.escape(newPass) +
      " WHERE password = " +
      mysql.escape(oldPass) +
      " AND username = " +
      mysql.escape(username);

    conn.query(sql, function (error, result) {
      var sql1 =
        "SELECT * FROM userinfo WHERE username =" + mysql.escape(username);

      conn.query(sql1, function (error, result) {
        response.render("Profile", { result: result });
      });
    });
  });
});

app.post("/checkSignup", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var fname = request.body.fname;
  var gender = request.body.gender;
  var phone = request.body.phone;

  conn.connect(function (error) {
    var sql = "select * from userinfo";

    conn.query(sql, function (error, result) {
      for (var i = 0; i < result.length; i++) {
        if (username === result[i].username) {
          console.log("username is already there");
          var res = "username is already there please pick new username ";

          response.render("landingPage", { result: res });
        }
      }
    });
  });
  conn.connect(function (error) {
    var sql1 =
      "insert into userinfo(username,password,fname,gender,phone) values('" +
      username +
      "','" +
      password +
      "','" +
      fname +
      "','" +
      gender +
      "','" +
      phone +
      "')";
    console.log(request.body);
    conn.query(sql1, function (error, result) {
      console.log("Record Sve Sucssfully");
      var res = "Sign up Successfull you can now log in";
      response.render("landingPage", { result: res });
    });
  });
});

app.post("/checkLogin", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  console.log(request.body);
  conn.connect(function (error) {
    var sql =
      "SELECT * FROM userinfo WHERE username =" +
      mysql.escape(username) +
      " AND password = " +
      mysql.escape(password);

    conn.query(sql, function (error, result) {
      if (error) throw error;
      console.log(result.length);
      if (result.length === 0) {
        var res = "username or password is incorrect";
        response.render("landingPage", { result: res });
      } else {
        response.render("homepage", { result: result });
      }
    });
  });
});

app.listen(9090);
