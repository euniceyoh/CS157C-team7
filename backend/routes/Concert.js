const ConcertAPI = require('../models/Concert')
const DateTime = require('../models/schema/DateTime')
const Concert = require('../models/schema/Concert')
const dbUtils = require('../dbUtils');
const express = require('express')
const router = express.Router()

router.use(express.json())

router.post("/", function (req, res) {
    
    const sampleDateTime = new DateTime(
        `${req.body.year}`,
        `${req.body.month}`,
        `${req.body.day}`,
        `${req.body.hour}`,
        `${req.body.minute}`,
        `${req.body.second}`,
        `${req.body.timezone}`,
    )

    const sampleConcert = new Concert(
        sampleDateTime,
        `${req.body.name}`
    )

    console.log(req.body) 

    ConcertAPI.createConcert(sampleConcert, dbUtils.getSession(req))
    .then(result => { // .then also returns a promise 
        console.log(result)
        if(result.hasOwnProperty('code')) { // error checking result, prob not the best way 
            res.status(500)
            res.send(result.message)
        } else {
            res.send(result) 
        }
    })
    .catch(error => {
        throw error 
    })
})


// Filter Concert 
router.get("/", function (req, res) {
    // Returns an object where keys are parameters
    const concertParams = req.query;    
    
    ConcertAPI.searchConcert(concertParams, dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            res.send(JSON.stringify(response));
        }else{
            res.status(res.statusCode);
            res.send(res.message);
        }
    })
    .catch(err=>{
        throw err;
    });
})

router.get("/:name", function (req, res) { 
    
    ConcertAPI.searchConcert(req.params, dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            res.send(JSON.stringify(response));
        }else{
            res.status(res.statusCode);
            res.send(res.message);
        }
    })
    .catch(err=>{
        throw err;
    });
})


// Filter Attendees to the concert
router.get("/attendees", (req, res)=>{
    const concertParams = req.query;

    ConcertAPI.searchAttendees(concertParams, dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            res.send(JSON.stringify(response));
        }else{
            res.status(res.statusCode);
            res.send(res.message);
        }
    })
    .catch(err=>{
        throw err;
    })
})

module.exports = router;

