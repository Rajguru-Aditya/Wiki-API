const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////// Requesting targetting all articles!! ////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, results) {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////// Requesting targetting a specific articles!! ////////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (err, result) {
      if (result) {
        res.send(result);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully Updated article.");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully Updated article.");
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("Server started at port 3000");
});
