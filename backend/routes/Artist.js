'use strict';
const ArtistAPI = require("../models/Artist");
const Artist = require("../models/schema/Artist")
const dbUtils = require("../dbUtils");
const express = require("express");
const { response } = require("express");
const router = express.Router();

// Get all artists
router.get("/", (req, res, next) => {
    ArtistAPI.getAll(dbUtils.getSession(req))
        .then(response => {
            if (res.statusCode === 200) {
                res.send(JSON.stringify(response));
            } else {
                res.send("Error happened!")
            }
        })
        .catch(next);
})

// Create new artist
router.post("/", (req, res) => {
    console.log(req.body)
    const newArtist = new Artist(req.body.name);
    ArtistAPI.create(newArtist, dbUtils.getSession(req))
    .then(
    response=>{
        if(response.statusCode === 201){
            console.log("Created! "+response);
            res.send(JSON.stringify(response));
        }else{
            res.status(res.statusCode);
            res.send(res.message);
        }
    }
    ).catch(error => {
        throw error 
    })
})

// Create PERFORMS connection
router.post("/perform", (req, res, next) => {
    console.log(req.body)
    const { artistName, concertName } = req.body;

    ArtistAPI.perfoms(artistName, concertName, dbUtils.getSession(req)) .then(
        response=>{
            if(response.statusCode === 201){
                console.log("Created! "+response);
                res.send(JSON.stringify(response));
            }else{
                res.status(res.statusCode);
                res.send(res.message);
            }
        }
        ).catch(error => {
            throw error 
        })
})


module.exports = router;
