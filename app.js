const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ //pass request
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
// request targetting all article
app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArti){
    if(!err)
    {
      res.send(foundArti);
    }
    else {
      res.send(err);
    }
  });
})

.post(function(req, res){  // when we use we have to save that post also('.' chain method indicate)
  console.log();
  console.log();

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save(function(err){
    if(!err)
    {
      res.send("Successfully added a new article.");
    }
    else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err)
    {
      res.send("Successfully deleted a new article.");
    }
    else {
      res.send(err);
    }
  });
});  //use to specified at a single location

//request targetting all articles//

app.route("/articles/:articleTitle")   //"/____/"  at end "/" use particular resource that they want

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle)
    {
      res.send(foundArticle);
    }
    else {
      res.send("No Articles");
    }
  })  //search condition
})

.post(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content}, // acutal post that we created
    {overwrite: true}, // to overwrite and delete data
    function(err){
      if(!err)
      {
        res.send("Successfully updated seleted article");
      }
    }
  );
})

.patch(function(req, res){   // use for updation of specific data
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},  //operatoe replaces the value of as field with specificed values
    function(err){
      if(!err)
      {
        res.send("Successfully updated article.");
      }
      else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted");
      }
      else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
