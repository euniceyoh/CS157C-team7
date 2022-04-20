'use strict';
const neo4j = require("neo4j-driver");
const driver = neo4j.driver("neo4j+s://463ded1b.databases.neo4j.io:7687",neo4j.auth.basic("can", "(ABCxyz98)"));


exports.getSession = (context) =>{
    if(!context.neo4jSession){
        context.neo4jSession = driver.session();
    }
    return context.neo4jSession;
}