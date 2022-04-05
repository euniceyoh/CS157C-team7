var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { use } = require('express/lib/application');


/*
 ulrEncodedParser middleware is used to invoke below function 
 to parse posted data to POST functions
 var urlEncodedParser = bodyParser.urlencoded({extended : false});
 var jsonParser = bodyParser.json();
 */

//set view engine to be able to visit views 
app.set('view engine', 'ejs');

//middleware for styles to be loaded on pages when req made by views
app.use('/stylesheets', express.static('stylesheets'));

// middleware to parse application/json
//app.use(express.json());

// middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


/*middleware to set req headers to text/html 
app.use(function (req, res, next) {
    req.headers['content-type'] = 'text/html';
    next();
  });*/


//GET "/" req, fires up home page
app.get('/', function(req, res){
    res.render('home');

});

//GET "/home" req, aslo fires up home page
app.get('/home', function(req, res){
    res.render('home');

});

//GET "/signup" req, fires up sign up page
app.get('/signup', function(req, res){
    res.render('signup');

});

//POST information enetered on sign up form
app.post('/signup', function(req, res){
    console.log(req.body);
    res.render('signup_success', {accountData: req.body});

});

//server to run on port 3000
app.listen(3000, function(){
    console.log('server listening on port 3000');
});