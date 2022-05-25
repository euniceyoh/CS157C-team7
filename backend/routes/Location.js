const LocationAPI = require("../models/Location")
const Location = require("../models/schema/Location")
const dbUtils = require("../dbUtils");
const express = require("express");
const router = express.Router();

// Get all available location
router.get("/", (req, res, next)=>{
    LocationAPI.getAll(dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            res.send(JSON.stringify(response));
        }else{
            res.send("Error happened!")
        }
    })
    .catch(next);
})

// Create new Location endpoint
router.post("/", (req, res) => {
    console.log(req.body)
    const newLocation = new Location("United States of America", req.body.city, req.body.state);
    LocationAPI.create(newLocation, dbUtils.getSession(req))
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

// HAS_LOCATION endpoint
router.post("/locate", (req, res) => {
    console.log(req.body)
    const newLocation = new Location("United States of America", req.body.city, req.body.state);
    const concertName = req.body.name;
    LocationAPI.hasLocation(newLocation, concertName, dbUtils.getSession(req))
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

module.exports = router;