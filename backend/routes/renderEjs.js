const express = require("express");
const router = express.Router(); // specifying a router 

router.get('/', (req, res ) => {
    res.render("templates/landingPage", {isLoggedIn:true}) // use this for demo 
})

module.exports = router; 
