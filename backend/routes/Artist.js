'use strict';
const Artist = require("../models/Artist");
const dbUtils = require("../dbUtils");
const express = require("express");
const { response } = require("express");
const router = express.Router();

router.get("/", (req, res, next)=>{

    Artist.getAll(dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            res.send(JSON.stringify(response));
        }else{
            res.send("Error happened!")
        }
    })
    .catch(next);
})


module.exports = router;