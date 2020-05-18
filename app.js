// A Simple BlogApp

var express     = require('express'),
    app         = express(),
    methodOverride = require('method-override')
    bodyParser  = require('body-parser');
    mongoose    = require('mongoose');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/blog_app",{ useNewUrlParser: true , useUnifiedTopology: true });
app.use(methodOverride("_method"));  // Treat 

//SCHEMA SETUP
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type: Date, default: Date.now}    // If no date given, default to date of that day, This could be done for other parameter also, like image
});

var Blog = mongoose.model("Blog", blogSchema);

// Temporary code
//Blog.create({
//    title: "Test Blog",
//    image: "https://images.unsplash.com/photo-1588788839689-132558996bea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80",
//    body: "This is a test blog and seems like a picture of  desert but it is really not about it, Its just a random picture"
//});

// RESTFULL ROUTES
// INDEX ROUTE
app.get("/", function(req, res){    // General convention like reddit
    res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});
        }
    })
});


// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req,res){
    //create a new blog post
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //redirect to /blogs
            res.redirect("/blogs")
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", { blog: foundBlog });
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    // Find existing blog with the id param and update it
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){  //(id, newData, callback)
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//delete route
app.delete("/blogs/:id", function(req, res){
    //destry blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            //redirect to index
            res.redirect("/blogs");
        }
    });
});



app.listen(3001, function(){
    console.log("Server Listening on port 3001")
});
