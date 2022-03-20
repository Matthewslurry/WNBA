const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const all_notes = require('./routes/users');
const config = require('./config/database');
const fileupload = require('express-fileupload')


//Passport config
const app = express();
require('./config/passport')(passport);

//DB Connection
mongoose.connect(config.database);
mongoose.connection.once('open', function(){
    console.log('Connected to MongoDB');
}).on('error', function(){
    console.log('Connectoin error.', error);
})


app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//session
app.use(session({
    secret: 'my secret',
    resave: true,
    saveUninitialized: true
}));


app.use(flash());
  // Global Variables
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash('error');
    next();
  });

  //Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());
app.use(fileupload())


//Route Files
const users = require('./routes/users');
app.use('/' , users);




app.get('/', function(req,res){
  res.render("./auth/login")
});

// app.get('/home', function(req,res){
//   res.render("./home")
// });

app.use(all_notes)

//body parser middle ware
app.use(bodyParser.urlencoded({ extended: false}));


app.use(bodyParser.json());


//public folder
app.use(express.static("public"));

app.get('*', function(req,res,next) {
    res.locals.user = req.user || null;
    next();
});





app.use(express.static("public"));
const PORT = process.env.PORT || 2000 ;

app.use(function(req, res, next){ 
    res.status(404).render('./user/error-404')
  });
    
app.listen(PORT, function (req, res) {
    console.log("server starting on port 2000...");
  });
  