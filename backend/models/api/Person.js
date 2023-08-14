const bcrypt = require("bcrypt");
const { verify } = require("jsonwebtoken");

function createPerson(person, session) { 
    const query = `CREATE (person: Person{
        name:"${person.name}",
        email: "${person.email}",
        gender: "${person.gender}",
        dob: "${person.dob}",
        imgurl: "${person.imgurl}",
        password: "${person.password}"
    })`
    // tx either succeeds or fails 
    return session.writeTransaction((tx) => 
        tx.run(query) 
    )
    .then(result => { // returns a promise 
        return result.summary
    }, error => {
        return error
    })
}

const login = (person, session) => {
    const query = `
    OPTIONAL MATCH (p:Person {email: '${person.email}'})
    RETURN p IS NOT NULL AS emailExists`

    console.log(query)
    
    return session.readTransaction((tx) => { return tx.run(query)})
    .then((result => { // do something with result 
        console.log(typeof result)
        console.log(result.records[0]._fields[0])
        if(result.records[0]._fields[0] == false) {
            throw new Error("Email does not exist"); 
        }
        
        // otherwise, check for password 
        const queryHashedPassword = `
        MATCH (p:Person {email: '${person.email}'}) 
        RETURN p.password AS hashedPassword`;

        console.log(queryHashedPassword);

        return session.readTransaction((tx) => {return tx.run(queryHashedPassword)})
    }))
    .then((result => {
        usersHashedPassword = result.records[0]._fields[0];
        console.log(usersHashedPassword); 
        
        return bcrypt.compare(person.password, usersHashedPassword)
    }))
    .then((result => {
        console.log("last")
        console.log(result);
        console.log(typeof result)

        if(result == false) {
            throw new Error("Password is incorrect"); 
        }
        
        // finally get the user (TODO: duplicate?)
        return getUser(person.email, session)
    }))
    .then((result => {
        console.log(result.records[0]['_fields'][0]['properties'])
        return result; 
    }))
    .catch((error => {
        if(error.message.includes("Email")) {
            console.error("email doesn't exist")
            throw new Error("Email does not exist"); // rethrow the error 
        } 
        if(error.message.includes("Password")) {
            console.error("password is incorrect")
            throw new Error("Password is incorrect");
        }
        return error;
    }))
}

function getUser(email, session) {
    const query = `
    MATCH (p:Person {email: '${email}'}) 
    RETURN p
    `   
    console.log(query)

    return session.readTransaction((tx) => {return tx.run(query)})
    .then(response => {
        return response 
    }, error => {
        return error
    })
}

function getUserRelations(data, session) {
    console.log(data)
    let name = data.name
    let rel = data.rel
    let outgoingNode = data.outgoingNode

    const query = `
    optional match (p:Person {name:"${name}"})-[:${rel}]->(o:${outgoingNode})
    return o
    `
    console.log(query)

    return session.readTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        return response
    }, error => {
        return error
    })
}

module.exports = {
    "createPerson": createPerson,
    "login": login,
    "getUser": getUser, 
    "getUserRelations": getUserRelations
}