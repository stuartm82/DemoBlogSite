//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut condimentum accumsan tempus. Praesent tempus, arcu ut aliquam tempus, erat elit pellentesque libero, pretium egestas lacus sem viverra odio. Sed sagittis maximus maximus. Vivamus euismod ac orci nec posuere. Aenean at felis interdum augue placerat cursus. Integer tristique leo eu urna congue blandit. Quisque at massa ultricies, ultrices ligula at, iaculis velit. Etiam auctor tellus urna, a convallis augue porta eu. Donec luctus semper felis quis posuere. Integer eu suscipit ligula, sit amet rutrum arcu. Mauris congue dictum suscipit. Pellentesque placerat euismod scelerisque. Sed ultrices sagittis quam. Pellentesque facilisis diam mi, vitae vulputate neque placerat a. Maecenas scelerisque accumsan convallis. Ut finibus leo in risus maximus dignissim. Praesent non ipsum condimentum, tincidunt tortor nec, porttitor quam. Maecenas in est nunc. Suspendisse tristique gravida pellentesque. Aenean egestas risus et tincidunt porta. Nam eget pellentesque tellus. Ut commodo quis mauris eget aliquam. Donec malesuada nisl in ornare malesuada. Cras dictum, nunc eu convallis eleifend, purus quam porta enim, vel rutrum neque velit non neque. Integer quis sollicitudin justo. Vivamus gravida dapibus turpis, vel ultrices nibh ultricies nec. Cras pharetra sit amet odio vel vestibulum. Curabitur id dolor sit amet ipsum mattis consequat. Aliquam eu consequat massa, ut tempus felis. Proin ac lacus commodo, blandit elit at, ultricies tortor. Donec convallis eros nunc, in malesuada lectus mollis a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut sodales turpis. Phasellus eleifend elit et est tincidunt, non tempus nisi convallis. Sed eu volutpat mauris, non cursus odio. Curabitur vitae ipsum tincidunt, ultrices ex id, congue sem. Morbi feugiat leo quam, quis auctor nisi tempus eu. Nunc in tincidunt lorem, at porttitor mauris. Curabitur orci mi, viverra vel eros vel, mollis vehicula nunc. Nunc nec libero laoreet, venenatis dui ut, facilisis lorem. Pellentesque fermentum dapibus.";
const aboutContent =
  "inIcelandic is a personalised blog-style website which collects and simplifies content from Icelandic media to support intermediate and advanced language learners";
const contactContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet dui ipsum, sit amet tempor lacus molestie et. Nullam eros velit, varius sit amet leo eu, egestas auctor neque. Praesent in mi ac leo condimentum fringilla. Suspendisse cursus metus et purus aliquet eleifend. Sed eu venenatis orci. In cursus, ante vitae fringilla imperdiet, est dui tempus ex, sed molestie nisi enim non neque. Aliquam erat volutpat. Vestibulum sed euismod neque. Fusce non neque ac arcu bibendum mattis. Integer malesuada lectus ac finibus dictum. Vestibulum scelerisque consequat risus quis fermentum";
const libraryContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true
});


const postSchema = mongoose.Schema({
  title: String,
  content: String,
  source: String,
  image: String
}, {
  timestamps: true,
});

//review here - rename as TodayPost and "sort" on the find function//
const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res) {
  const latestPosts = await Post.find({}).limit(1).sort({
    $natural: -1
  });
  const recentPosts = await Post.find({}).skip(1).limit(4).sort({
    $natural: -1
  });

  res.render("home", {
    latestPosts,
    recentPosts,
  });
});

app.get("/library", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("library", {
      libraryContent,
      posts:posts
    });
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  //javascript object to store variables from /compose page
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    source: req.body.postSource,
    image: req.body.postImage
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({
      _id: requestedPostId,
    },
    function(err, post) {
      res.render("post", {
        title: post.title,
        content: post.content,
        source: req.body.postSource,
        image: req.body.postImage
      });
    }
  );
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent,
    contactContent: contactContent,
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
