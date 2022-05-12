const ConcertAPI = require('../models/Concert')
const DateTime = require('../models/schema/DateTime')
const Concert = require('../models/schema/Concert')
const dbUtils = require('../dbUtils');
const express = require('express')
const router = express.Router();
const path = require("path");

// For storing image
const multer = require("multer");
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
});

router.use(express.json())



router.post("/", upload.single("concertImage"), function (req, res) {

    console.log(req.body);
    const sampleDateTime = new DateTime(
        `${req.body.year}`,
        `${req.body.month}`,
        `${req.body.day}`,
        `${req.body.hour}`,
        `${req.body.minute}`,
        `${req.body.second}`,
        // `${req.body.date.timezone}`,
    )

    const sampleConcert = new Concert(
        sampleDateTime,
        `${req.body.name}`,
        `${req.body.concertImage}`,
    )


    ConcertAPI.createConcert(sampleConcert, dbUtils.getSession(req))
    .then(
    //     result => { // .then also returns a promise 
    //     console.log(result)
    //     if(result.hasOwnProperty('code')) { // error checking result, prob not the best way 
    //         res.status(500)
    //         res.send(result.message)
    //     } else {
    //         res.send(result) 
    //     }
    // }
    response=>{
        if(res.statusCode === 201){
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


// Filter Concert 
router.get("/", function (req, res) {
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
    });
})


// Filter Attendees to the concert
router.get("/:name/attendees", (req, res)=>{
    const concertParams = req.params;
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
    })
})

module.exports = router;

