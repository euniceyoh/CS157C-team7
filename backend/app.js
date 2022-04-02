'use strict';

const express = require("express");
const artistRouter = require("./routes/Artist");
const concertRouter = require("./routes/Concert")
const app = express(), api = express();


app.use("/api/v1/artist",artistRouter)

app.use("/concert", concertRouter)

app.listen(3000 , () =>{
    console.log("Server is running on port 3000...");
})

// test 
app.get('/', function(req, res) {
    res.send("Hello World")
})
