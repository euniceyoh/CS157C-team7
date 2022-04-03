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

module.exports = router;

