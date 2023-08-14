// starting point of application 

'use strict';

const express = require("express");
const session = require("express-session"); 
const app = express();
const bodyParser = require('body-parser');
const artistRouter = require("./backend/routes/Artist");
const concertRouter = require("./backend/routes/Concert");
const personRouter = require("./backend/routes/Person");
const locationRouter = require("./backend/routes/Location")
// const renderRouter = require("./backend/routes/renderEjs")
const PORT = process.env.PORT || 3000; // every application deployed runs on a specific port, which is assigned randomly by onrender? 
const path = require('path');

// enable express-session (middleware): can access session object in my routes & middleware
// access via req.session object 
// default storage: MemoryStore (not intended for production)
app.use(session({
    secret: process.env.SESSION_SECRET, // TODO: 
    name: `7MyWOEv1Cv`, 
    resave: false, 
    saveUninitialized: false
})); 

//set view engine to be able to visit views 
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// source: https://expressjs.com/en/starter/static-files.html
// used to serve static files: CSS, JS files in express; middleware to publicly access its contents 
app.use(express.static(path.join(__dirname, 'views'))); 

//middleware for styles to be loaded on pages when req made by views
app.use(express.json());
// middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// specifies endpoint for each router 
app.use("/api/v1/artist",artistRouter)
app.use("/api/v1/concert", concertRouter)
app.use("/api/v1/person", personRouter)
app.use("/api/v1/location", locationRouter)
// specify endpoint for rendering content here 
// rendering the ejs templates starts here 
// app.use("/", renderRouter); attempt later 

app.listen(PORT , () =>{
    console.log(`server started on port ${PORT}`);
})

// middleware: does it always need next? 
var sessionChecker = (req, res, next) => {}

// check if logged in or not via middleware
app.get('/', (req, res) => {
    res.render("templates/landingPage", {user: req.session.profile}) // use this for demo 
})

app.get('/signup', (req, res) => {
    res.render("templates/userauth/signup", {user: req.session.profile}) 
})

app.get('/log-in', (req, res) => {
    res.render("templates/userauth/login", {user: req.session.profile})
})

app.get('/attendee/:name', function(req, res) {
    res.render("templates/attendee", {user: req.session.profile, name: req.params['name']})
})

app.get('/concert/:name', function(req, res) {
    console.log(req.params);
    res.render("templates/concert/concert", {user: req.session.profile, name: req.params['name']})
})

app.get('/log-out', function(req, res) {
    req.session.destroy();
    res.redirect('/'); 
})

// app.get("/create-concert", (req, res)=>{
//     res.render("templates/concert/createConcert", {isLoggedIn:true})
// })
// app.get("/create-artist", (req, res)=>{
//     res.render("templates/artist/createArtist", {isLoggedIn:true})})

// app.get("/update-concert", (req, res) => {
//     res.render("templates/concert/updateConcert", {isLoggedIn:true})
// })

// // search for concert page
// app.get('/concert-search', function(req, res) {
//     res.render("templates/concert/filterConcert", {isLoggedIn:true})
// })

// app.get('/artist-search', function(req, res) {
//     res.render("templates/filterArtist", {isLoggedIn:true})
// })

// app.get("/artist-update", function(req, res) {
//     res.render("templates/artist/updateArtist", {isLoggedIn:true})
// })

// app.get('/artist/:name', function(req, res) {
//     console.log(req.params);
//     res.render("templates/artist/artist", {name:req.params['name'], isLoggedIn:true})
// })



