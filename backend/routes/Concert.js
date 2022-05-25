const ConcertAPI = require('../models/Concert')
const DateTime = require('../models/schema/DateTime')
const Concert = require('../models/schema/Concert')
const dbUtils = require('../dbUtils');
const express = require('express');
const res = require('express/lib/response');
const router = express.Router()
const path = require("path");
const { route } = require('./Artist');

router.use(express.json())


router.post("/willAttend", function (req, res) {
    console.log("/willAttend: " + req.body)

    ConcertAPI.addNewAttendConcert(req.body, dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result)
    })
    .catch(error => {
        throw error
    })
})

router.post("/deleteAttend", function (req, res) {
    console.log("/deleteAttend: " + req.body)

    ConcertAPI.deleteAttendConcert(req.body, dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result)
    })
    .catch(error => {
        throw error
    })
})

router.get("/willAttendExists", (req, res) => {
    //console.log(req.body)
    console.log(req.query)

    ConcertAPI.attendeeExists(req.query, dbUtils.getSession(req))
    .then(result => {
        console.log(result[0]._fields[0]) // value 
        res.send(result[0]._fields[0])
    })
    .catch(error => {
        throw error
    })
})

router.get("/location", (req, res) => {
    console.log(req.query)
    
    ConcertAPI.getConcertLocation(req.query, dbUtils.getSession(req))
    .then(result => {
        console.log(result) // value 
        res.send(result)
    })
    .catch(error => {
        throw error
    })
})


// router.post("/", function (req, res) {

// For storing image
const multer = require("multer");
const { resourceUsage } = require('process');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname,'/uploads/'));
    },
    filename: function(req, file, cb) {
      cb(null,  file.originalname);
    }
  });
const fileTypeFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error("Wrong File Type"), false);
      }
}
const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 8
    },
    fileFilter:fileTypeFilter
})

router.post("/update", function(req, res) {
    console.log(req.body)
    // check which fields are empty 
    // fields to update: date, url 

    let dateTime = null
    console.log("year" + req.body.year)

    if(req.body.year != null) {
        dateTime = new DateTime(
            `${req.body.year}`,
            `${req.body.month}`,
            `${req.body.day}`,
            `${req.body.hour}`,
            `${req.body.minute}`,
            `${req.body.second}`
        )
        console.log(dateTime)
    }

    const sampleConcert = new Concert(
        dateTime, // may be null 
        `${req.body.name}`,
        `${req.body.concertImage}` // may be empty 
    )
    
    return ConcertAPI.updateConcert(sampleConcert, dbUtils.getSession(req))
    .then(
        response=>{
            console.log(response)
            if(res.statusCode === 200){
                console.log("Updated! "+response);
                res.send(JSON.stringify(response));
            }else{
                console.log("IDK what happened!")
                res.status(res.statusCode);
                res.send(res.message);
            }
        }
    ).catch(error => {
        throw error 
    })
})

router.post("/", function (req, res) {
    console.log(req.body);
    const sampleDateTime = new DateTime(
        `${req.body.year}`,
        `${req.body.month}`,
        `${req.body.day}`,
        `${req.body.hour}`,
        `${req.body.minute}`,
        `${req.body.second}`
    )

    const sampleConcert = new Concert(
        sampleDateTime,
        `${req.body.name}`,
        `${req.body.concertImage}`
    )

    ConcertAPI.createConcert(sampleConcert, dbUtils.getSession(req))
    .then(
        response=>{
            if(res.statusCode === 201){
                console.log("Created! "+response);
                res.send(JSON.stringify(response));
            }else{
                console.log("IDK what happened!")
                res.status(res.statusCode);
                res.send(res.message);
            }
        }
        ).catch(error => {
            throw error 
        })
})

router.post("/delete", function(req, res) {
    const concertParams = req.body
    console.log(concertParams)

    ConcertAPI.deleteConcert(concertParams, dbUtils.getSession(req))
    .then(response => {
        if(res.statusCode === 200) {
            res.send(JSON.stringify(response))
        } else {
            res.status(res.statusCode)
            res.send(res.message)
        }
    })
    .catch(err => {
        throw err 
    })
})

// Filter Concert 
router.get("/filter", function (req, res) {
    // Returns an object where keys are parameters
    const concertParams = req.query;    
    console.log(Object.keys(concertParams).length)
    ConcertAPI.searchConcertWithFilter(concertParams, dbUtils.getSession(req))
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

// Add get all concerts here 
router.get("/", function (req, res) {
    ConcertAPI.getAllConcerts(dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result)
    })
    .catch(error => {
        throw error 
    })
})

// Filter Attendees to the concert
router.get("/attendees", (req, res)=>{
    const concertParams = req.query;
    console.log(concertParams)

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
    });
})

router.get("/future-concert/:artist", (req, res) =>{
    console.log(req.params+" Hit")
    ConcertAPI.futureConcertOfArtist(req.params.artist, dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            console.log("Returned!!")
            res.send(JSON.stringify(response));
        }else{
            res.status(res.statusCode);
            res.send(res.message);
        }
    })    .catch(err=>{
        throw err;
    });

})

router.get("/past-concert/:artist", (req, res) =>{
    console.log(req.params+" Hit")
    ConcertAPI.pastConcertOfArtist(req.params.artist, dbUtils.getSession(req))
    .then(response=>{
        if(res.statusCode === 200){
            console.log("Returned!!")
            res.send(JSON.stringify(response));
        }else{
            res.status(res.statusCode);
            res.send(res.message);
        }
    })    .catch(err=>{
        throw err;
    });

})


router.get("/:name", function (req, res) { 
    console.log(req.params)
    ConcertAPI.searchConcertWithFilter(req.params, dbUtils.getSession(req))
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




module.exports = router
