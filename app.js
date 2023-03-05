const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Create a beautiful blog that fits your style. Choose from a selection of easy-to-use templates – all with flexible layouts and hundreds of background images – or design something new. Give your blog the perfect home. Get a Farhan.com domain or buy a custom domain with just a few clicks.";
const aboutContent = "Hi I am Farhan, I am a Full stack web developer I Live in India in Uttarpradesh if you want your own website then I am here for you mail me at 696996969@gmail.com and phone number is 9192..... i can see your order as soon as possible";
const contactContent = "Visit My Website for more information.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

const blogSchema = new mongoose.Schema({
  title : String,
  message : String
});

const Blog = mongoose.model("blog", blogSchema);

app.get("/", function(req, res){
  const findBlog = async ()=> {
    try {
      const result = await Blog.find()
      res.render("home", {
        startingContent: homeStartingContent,
        posts: result
        });
    } catch (error) {
      console.log(error);
    }
  }
  findBlog();
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  const blogs = new Blog({
    title : post.title,
    message : post.content
  });

  blogs.save().then((result)=>{
    console.log(result);
  })

  res.redirect("/");

});

app.post("/", (req, res)=>{
  const checkbox = req.body.delete;
  const deleteBlog = Blog.findByIdAndDelete(checkbox).then(()=>{
    console.log("Successfully deleted blog");
  });
  res.redirect("/");
})

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const findResult = async ()=>{
    try {
      const findTitle = await Blog.find();
      for (let i = 0; i < findTitle.length; i++) {
        const customTitle = _.lowerCase(findTitle[i].title);
        console.log(customTitle);
        if (customTitle === requestedTitle) {
          res.render("post", {title : findTitle[i].title, content: findTitle[i].message})
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  findResult();
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});