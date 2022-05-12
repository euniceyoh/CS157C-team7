'use strict';

const express = require("express");
const bodyParser = require('body-parser');
const { use } = require('express/lib/application');

const artistRouter = require("./backend/routes/Artist");
const concertRouter = require("./backend/routes/Concert");
const personRouter = require("./backend/routes/Person")
const res = require("express/lib/response");
const app = express();

//set view engine to be able to visit views 
app.set('view engine', 'ejs');

//middleware for styles to be loaded on pages when req made by views
app.use(express.static(__dirname+'/views'));

// middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/artist",artistRouter)
app.use("/api/v1/concert", concertRouter)
app.use("/api/v1/person", personRouter)

app.listen(3000 , () =>{
    console.log("Server is running on port 3000...");
})

// test 
app.get('/', function(req, res) {
    res.render("templates/landingPage", {isLoggedIn:true}) 
})

app.get("/create-concert", (req, res)=>{
    res.render("templates/createConcert", {isLoggedIn:true})
})

// search for concert page
app.get('/concert-search', function(req, res) {
    res.render("templates/filterConcert", {isLoggedIn:true})
})

app.get('/concert/:name', function(req, res) {
    console.log(req.params);
    res.render("templates/concert", {name:req.params['name']})
})

app.get('/attendee/:id', function(req, res) {
    res.render("templates/attendee")
})

