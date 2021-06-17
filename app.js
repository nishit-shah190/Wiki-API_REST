const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article" , articleSchema);

app.route("/articles")
.get(function(req,res)
{
    Article.find(function(err, foundArticles)
    {
        
    
      
        res.send(foundArticles);
    })
})
.post(function(req,res)
{
    console.log();
    console.log();
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save();
})
.delete(function(req,res)
{
    Article.deleteMany(function(err)
    {
        if(!err)
        {
            res.send("Successfully deleted");
        }
        else
        {
            res.send("Deleted");
        }
    })
});

/////Requesting a specific article//////

app.route("/articles/:articleTitle")
.get(function(req,res)
{
    console.log(req.params.articleTitle);
    Article.findOne({title:req.params.articleTitle} , function(err, foundArticle)
    {
        if(foundArticle)
        {
            res.send(foundArticle);
        }
        else
        {
            res.send("No Article Found");
        }
    });
})
.put(function(req,res)
{
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err)
            {
                res.send("Successfully updated");
            }
            else
            {
                res.send(err);
            }
        });
})
.patch(function(req,res)
{
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err)
        {
            if(!err)
            {
                res.send("Successfully saved");
            }
            else
            {
                res.send(err);
            }
        }
    );
})
.delete(function(req,res)
{
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err)
        {
            if(!err)
            {
                res.send("deleted");
            }
            else
            {
                res.send(err);
            }
        }
    );
})

app.listen(3000, function()
{
    console.log("Server has started in port 3000");
})

