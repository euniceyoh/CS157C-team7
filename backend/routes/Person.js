const PersonAPI = require("../models/Person")
const dbUtils = require('../dbUtils');
const express = require('express');
const router = express.Router()

router.use(express.json())

router.get("/getUser", (req, res) => {
    console.log(req.query)

    PersonAPI.getUser(req.query, dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result[0]['_fields'][0]['properties'])
    })
    .catch(error => {
        throw error
    })
})

router.get("/getRelations", (req, res) => {
    console.log(req.query)

    PersonAPI.getUserRelations(req.query, dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result)
    })
    .catch(error => {
        throw error
    })
})

module.exports = router

