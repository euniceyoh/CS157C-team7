const PersonAPI = require("../models/api/Person")
const session = require('express-session');
const Person = require('../models/schema/Person')
const dbUtils = require('../dbUtils');
const express = require('express');
const router = express.Router()
const bcrypt = require("bcrypt");
const { render } = require('express/lib/response');
const _ = require('lodash');
const { hash } = require("bcrypt");
const jwt = require('jsonwebtoken');

const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(express.json())

router.post('/signup', function (req, res) {
   try {
     // Get user input
     const { name, email, gender, dob , imgurl, password } = req.body;

    // Validate user input
     if (!(name && email && gender && dob && imgurl && password)) {
       res.status(400).send("All input is required");
        }
    } catch (err) 
    {
        console.log(err);
    }   
    
    const passwordHash = bcrypt.hashSync(req.body.password, 12);
   
    const samplePerson = new Person(
        `${req.body.name}`,
        `${req.body.email}`,
        `${req.body.gender}`,
        `${req.body.dob}`,
        `${req.body.imgurl}`,
        `${passwordHash}`,
    )

    // TODO: existingUser API call is ?
    PersonAPI.existingUser(samplePerson,dbUtils.getSession(req))
    .then(result=>{
        // validate input: make more concise here 
        console.log(result)
        console.log(result[0]._fields[0]) 
        if(result[0]._fields[0]){
            console.log("Email already exists")
            req.session.context = req.body;
            return res.redirect(302, '/signup_failed'); // signup failed so redirect 
        }else{ 
            // TODO: nested API calls are not good 
            PersonAPI.createPerson(samplePerson, dbUtils.getSession(req))
            .then(result=>{
                console.log(result)
                if(res.statusCode === 200){ // successful account creation 
                    
                    /** store session information here */
                    //req.session.username = req.body.name;
                    req.session.profile = samplePerson; 
                    console.log(req.session.profile); 
                    
                    res.redirect('/'); // go back to homepage 
                }else{
                    res.status(res.statusCode);
                    res.send(res.message);
                }
            })
            .catch(err=>{
                throw err;
            });
        }
    })
    .catch(err=>{
        throw err;
    });
})

// router.get('/signup_failed', function(req, res) {
//     var context = req.session.context;
//     console.log(context)
//     res.render("../views/templates/userauth/signup_failed", {formData: context});
// })


// TODO: need to fix this 
router.post('/login', function (req, res) {
    const {email, password } = req.body;
    if (!(email && password)) {
        res.status(400).send("All input is required");
    } 

    PersonAPI.login(req.body, dbUtils.getSession(req))
    .then((result => {
        console.log(result.records[0]['_fields'][0]['properties'])
        req.session.profile = result.records[0]['_fields'][0]['properties']; 
        res.redirect('/'); 
    }))
    .catch(error => { // error should be caught here 
        if(error.message.includes("Email")) {
            res.status(400).send("Email does not exist");
        } else if(error.message.includes("Password")) {
            res.status(400).send("Password is incorrect");
        } else {
            res.status(400).send("Error");
        }
    })
})

// just make one route called login that checks: 
// 1. if user exists, and if so, login the user 
router.get("/getUser", (req, res) => {
    console.log(req.query)
    PersonAPI.getUser(req.query.email, dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result.records[0]['_fields'][0]['properties']) 
    })
    .catch(error => {
        throw error // error thrown: Neo4jError: Could not perform discovery. No routing servers available. Known routing table: RoutingTable[database=default database, expirationTime=0, currentTime=1691142239152, routers=[], readers=[], writers=[]]
    })              // i think b/c data instance doesn't exist anymore (i could specifically check for this error)
})

router.get("/getRelations", (req, res) => {
    console.log(req.query)

    PersonAPI.getUserRelations(req.query, dbUtils.getSession(req))
    .then(result => {
        console.log("/getRelations")
        console.log(result)
        res.send(result)
    })
    .catch(error => {
        throw error
    })
})

module.exports = router

