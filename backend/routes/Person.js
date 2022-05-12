const PersonAPI = require("../models/Person")
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


router.get('/signup', function(req, res) {
    res.render("templates/signup");
})

router.post('/signup', function (req, res) {

    const passwordHash = bcrypt.hashSync(req.body.password, 12);

    const samplePesron = new Person(
        `${req.body.name}`,
        `${req.body.email}`,
        `${req.body.gender}`,
        `${req.body.dob}`,
        `${req.body.imgurl}`,
        `${passwordHash}`,
    )

    PersonAPI.createPerson(samplePesron, dbUtils.getSession(req))
    .then(result=>{
        console.log(result)
        console.log("Reached test")
        if(res.statusCode === 200){
            console.log("Reached test2")
            res.render('../views/templates/signup_success', {accountData: req.body});
            console.log("Reached test2.5")
        }else{
            console.log("Reached test3")
            res.status(res.statusCode);
            res.send(res.message);
        }
    })
    .catch(err=>{
        throw err;
    });

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

router.post('/login', function (req, res) {

    const LpasswordHash = bcrypt.hashSync(req.body.password, 12);
    console.log(req.body)
    console.log(LpasswordHash)
    //login(dbUtils.getSession(req), req.body.email, LpasswordHash); 

})

var me = function(session, email) {
    return session.run('MATCH (user:Person {email: $email}) RETURN user', {
            email: email
        })
        .then(results => {
            if (_.isEmpty(results.records)) {
                throw {
                    message: 'Email Not Found',
                    status: 401
                };
            }
            return new Person(results.records[0].get('user'));
        });
};

var login = function(session, email, Lpass) {
    return session.run('MATCH (user:Person {email: $email}) RETURN user', {
            email: email
        })
        .then(results => {
            if (_.isEmpty(results.records)) {
                throw {
                    email: 'Email does not exist in the db',
                    status: 400
                }
            }
            
            else {
                var dbUser = _.get(results.records[0].get('user'), 'properties');
                if (dbUser.password != Lpass) {
                    throw {
                        password: 'wrong password',
                        status: 400
                    }
                }
                return {
                    token: _.get(dbUser, 'email')
                };
            }
        });
};

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

