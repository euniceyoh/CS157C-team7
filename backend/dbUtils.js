'use strict';
const neo4j = require("neo4j-driver");
require('dotenv').config()

const driver = neo4j.driver(process.env.DB_URI,neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASSWORD));

exports.getSession = (context) =>{
    if(!context.neo4jSession){
        context.neo4jSession = driver.session();
    }
    return context.neo4jSession;
}

