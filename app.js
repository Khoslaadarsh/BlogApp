var express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    app         = express(),
    methodOverride = require('method-override'),
    expressSanitizer = require("express-sanitizer");

// APP CONFIG
    mongoose.connect("mongodb://localhost:27017/Restful_Blog_App02",{useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride('_method'));


// MONGOOSE/MODEL CONFIG
var blogSchema  = new mongoose.Schema({
    title   : String, 
    image   : String, 
    body    : String,
    created : {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// RESTFUL ROUTES


app.get('/', (req, res)=>{
    res.redirect('/blogs');
});
// INDEX ROUTE
app.get('/blogs',(req, res)=>{
    
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('index', {blogs: blogs});
        }
    })
});

// NEW ROUTE
app.get('/blogs/new',(req, res)=>{
    res.render("new");
})

// CREATE ROUTE
app.post('/blogs', (req, res)=>{
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render('new');
        }else{
            // then, redirect to the index
            res.redirect('/blogs');
        }
    })
    
})

// SHOW ROUTE
app.get('/blogs/:id', (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
           res.redirect('/blogs');
            // console.log(err);
        }else{
            res.render('show', {blog: foundBlog});
        }
    })
})

// Edit route
app.get('/blogs/:id/edit', (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            console.log(foundBlog);
            res.render('edit', {blog: foundBlog});
        }
    })
})

// Update Route
app.put('/blogs/:id', (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    })
})

// DESTROY Route
app.delete('/blogs/:id', (req, res)=>{
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })

})


// PORT LISTNING
app.listen('49966' , ()=>{
    console.log('Sever Started');
})