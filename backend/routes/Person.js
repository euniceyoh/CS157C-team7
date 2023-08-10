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

router.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
router.use(cookieParser());
router.use(express.json())

router.get('/signup', function(req, res) {
    res.render("../views/templates/signup", {isLoggedIn:false}) 
})

router.post('/signup', function (req, res) { // when or how is this called? 
    //Fields input check 
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
        //`${token}`
    )

    PersonAPI.existingUser(samplePerson,dbUtils.getSession(req))
    .then(result=>{
        console.log("Reached test0")
        console.log(result)
        console.log("Reached test1")
        console.log(result[0]._fields[0]) 
        console.log("Reached test1.5")
        if(result[0]._fields[0]){
            console.log("Reached test2")
            console.log("Email already exists")
            req.session.context = req.body ;
            return res.redirect(302, '/signup_failed');
        }else{
            PersonAPI.createPerson(samplePerson, dbUtils.getSession(req))
            .then(result=>{
                console.log(result)
                console.log("Reached test4")
                if(res.statusCode === 200){
                    console.log("Reached test5")
                    res.render('../views/templates/signup_success', {accountData: req.body});
                    console.log("Reached test6")
                }else{
                    console.log("Reached test7")
                    res.status(res.statusCode);
                    res.send(res.message);
                }
            })
            .catch(err=>{
                throw err;
            });
            console.log("Reached test8")
            //res.status(res.statusCode);
            //res.send(res.message);
        }
    })
    .catch(err=>{
        throw err;
    });
})

router.get('/signup_failed', function(req, res) {
    var context = req.session.context;
    console.log(context)
    res.render("templates/signup_failed", {formData: context});
})

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};


router.get('/login', function(req, res) {
    res.render("templates/login");
})

router.post('/login', async function (req, res) {

    try{
        const {email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    }
    catch(err) {
        throw err
    }

    PersonAPI.loginUser(req.body,dbUtils.getSession(req))

})

router.get("/getUser", (req, res) => {
    console.log(req.query)

    PersonAPI.getUser(req.query, dbUtils.getSession(req))
    .then(result => {
        console.log(result)
        res.send(result[0]['_fields'][0]['properties']) // TypeError: Cannot read properties of undefines 
    })
    .catch(error => {
        throw error // error thrown: Neo4jError: Could not perform discovery. No routing servers available. Known routing table: RoutingTable[database=default database, expirationTime=0, currentTime=1691142239152, routers=[], readers=[], writers=[]]
    })              // i think b/c data instance doesn't exist anymore (i could specifically check for this error)
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

