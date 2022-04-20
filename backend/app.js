'use strict';

const express = require("express");
const artistRouter = require("./routes/Artist");
const app = express(), api = express();

app.use("/api/v1/artist",artistRouter)

app.listen(3000 , () =>{
    console.log("Server is running on port 3000...");
})