'use strict';
const ArtistAPI = require("../models/Artist");
const Artist = require("../models/schema/Artist")
const dbUtils = require("../dbUtils");
const express = require("express");
const { response } = require("express");
const router = express.Router();

// Get all artists
router.get("/is-favorite", (req, res)=>{
    console.log(req.query);

    ArtistAPI.isFavorite(req.query.user, req.query.artist_name, dbUtils.getSession(req))
    .then(response => {
        if (res.statusCode === 200) {
            res.send(JSON.stringify(response));
            res.end();
        } else {
            res.send("Error happened!")
        }
    })
})

router.get("/:name", (req, res, next) => {
    console.log(req.params)
    ArtistAPI.getArtist(req.params.name, dbUtils.getSession(req))
        .then(response => {
            if (res.statusCode === 200) {
                res.send(JSON.stringify(response));
            } else {
                res.send("Error happened!")
            }
        })
        .catch(next);
})

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


router.post("/favorite", (req, res) =>{
    console.log(req.body);

    ArtistAPI.favorite(req.body.user, req.body.artist_name, dbUtils.getSession(req))
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

// Create new artist
router.post("/", (req, res) => {
    console.log(req.body)
    const newArtist = new Artist(req.body.name, req.body.url);
    ArtistAPI.create(newArtist, dbUtils.getSession(req))
    .then(
        response=>{
            if(response.statusCode === 201){
                console.log("Created! "+response);
                res.send(JSON.stringify(response));
                res.end();
            }else{
                res.status(res.statusCode);
                res.send(res.message);
                res
            }
        }
        ).catch(error => {
            throw error 
        })
})

router.put("/:name", (req, res)=>{
    console.log(req.params.name+" "+req.body);
    ArtistAPI.update(req.body.name, req.body.url, dbUtils.getSession(req))
    .then(
        response=>{
            if(response.statusCode === 204){
                console.log("Updated! "+response);
                res.send(JSON.stringify(response));
                res.end();
            }else{
                res.status(res.statusCode);
                res.send(res.message);
                res
            }
        }
        ).catch(error => {
            throw error 
        })
})

router.delete("/unfavorite", (req, res) =>{
    console.log(req.body);

    ArtistAPI.unfavorite(req.body.user, req.body.artist_name, dbUtils.getSession(req))
    .then(
        response=>{
            if(response.statusCode === 204){
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

router.delete("/:name", (req, res) =>{
    console.log(req.params);

    ArtistAPI.delete(req.params.name, dbUtils.getSession(req))
    .then(
        response=>{
            if(response.statusCode === 204){
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
