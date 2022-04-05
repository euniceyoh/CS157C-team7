'use strict';

const express = require("express");
const artistRouter = require("./routes/Artist");
const concertRouter = require("./routes/Concert")
const app = express(), api = express();

app.set("view engine", "ejs");

app.use("/api/v1/artist",artistRouter)
app.use("/api/v1/concert", concertRouter)

app.listen(3000 , () =>{
    console.log("Server is running on port 3000...");
})

// test 
app.get('/', function(req, res) {
    res.send("Hello World")
})

// search for concert page
app.get('/concert-search', function(req, res) {
    res.render("templates/filterConcert")
})