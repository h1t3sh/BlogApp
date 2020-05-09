// A Simple BlogApp

var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser');
    mongoose    = require('mongoose');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/blog_app",{ useNewUrlParser: true , useUnifiedTopology: true });

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









app.listen(3001, function(){
    console.log("Server Listening on port 3001")
});
