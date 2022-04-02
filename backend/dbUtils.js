'use strict';
const neo4j = require("neo4j-driver");

// create env file for this 
const driver = neo4j.driver("neo4j+s://463ded1b.databases.neo4j.io:7687",neo4j.auth.basic("neo4j", "RBmgtH_rMJ2DZ0JqttmSmighTacdiEmIVPzK0n1QPz8"));

exports.getSession = (context) =>{
    if(!context.neo4jSession){
        context.neo4jSession = driver.session();
    }
    return context.neo4jSession;
}

// do we need to close session....???? :SDJFLKjsdljkfa