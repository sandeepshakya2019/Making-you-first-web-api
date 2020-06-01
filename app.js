//jshint esversion:6

/*
  -------------------- Steps to create the API ------------------------------------
  1) Setup the Server and MongoDB connnections
  2) Get ALl Article form the database
    by using the postman we can (GET,POST,DELETE,PUT,PATCH) any request
  3) Post the article (using the postman)
  4) Delete the articles (Using the POSTMAN)
  5) Making a chaneble route handler .... other file chain.js
  6) Request a specific articles (with PATCH request)
  7) you can use the postman to run all the requests (like GET,POST,PUT,PATCH,DELETE)
*/
//require the npm packages express,mongoose,bodyparser,ejs
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// defining the app instace
const app = express();
// creting a view port engine
app.set('view engine', 'ejs');
// using the body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
//to make the use of the static files like hmtl and css javascript
app.use(express.static("public"));
// conenction with mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
//making the schema for the article
const articleSchema = {
  title: String,
  content: String
};
// creating the mongoose model or collecction
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////
// using the route // articles
app.route("/articles")
//using the get
.get(function(req, res){
  //fincding the all articles
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
//using the post
.post(function(req, res){
  // creating the new article
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})
// using the delete
.delete(function(req, res){
  //delete all the articles
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////
//using the route for articles/:anytopicname
app.route("/articles/:articleTitle")
// using the get
.get(function(req, res){
  //finding the article
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})
//using the put
.put(function(req, res){
  // update the article with all the params(2)
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})
//using the patch
.patch(function(req, res){
  // update the article with the one or more then one params
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})
//using the delete
.delete(function(req, res){
  //delete the one article
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});


//listening at the port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
