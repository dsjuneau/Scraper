var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODBURI = process.env.MONGODBURI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODBURI, {
  useNewUrlParser: true
});

// Routes

// Completed route for loading the initial page and any saved database items
app.get("/", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      var articles = {
        articles: dbArticle
      };
      res.render("index", articles);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Completed route and async function for checking if the article is already stored.
app.get("/api/scrape", storeInDb);

async function storeInDb(req, res) {
  let response = await axios.get("http://www.echojs.com/");
  var $ = cheerio.load(response.data);
  var numArticles = 0;
  let rawArticles = $("article h2");
  for (var i = 0; i < rawArticles.length; i++) {
    var result = {};
    result.title = $(rawArticles[i])
      .children("a")
      .text();
    result.link = $(rawArticles[i])
      .children("a")
      .attr("href");
    console.log(result);
    let art = await db.Article.findOne({ title: result.title });
    console.log(art);
    if (art === null) {
      numArticles++;
      console.log(result);
      await db.Article.create(result);
    }
  }
  console.log(numArticles);
  res.send({ number: numArticles });
}

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/api/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/api/articles/:title", function(req, res) {
  console.log(req.body);
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { title: req.params.title },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
