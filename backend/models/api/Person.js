
// Person End Point
const bcrypt = require("bcrypt");


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


function existingUser(person, session) { 
   
    let email = person.email
    
    const query = `
    OPTIONAL MATCH (p:Person {email: '${email}'})
    RETURN p IS NOT NULL AS emailExists`
    
    console.log(query)
   
    return session.readTransaction((tx) => {
        console.log(".then test reached")
        return tx.run(query)
    })
    .then(response => {
        console.log("before reponse test")
        console.log(response)
        console.log("------------------")
        console.log("before reponse.records test")
        console.log(response.records)

        return response.records
    }, error => {
        return error
    })
}

async function loginUser(person, session) {
    const emailMatchResult = await existingUser(person, session)
    .then(result=>{
        console.log("Reached test0")
        console.log(result)
        console.log("Reached test1")
        console.log(result[0]._fields[0]) 
        console.log("Reached test1.5")
        return result[0]._fields[0]   
    })
    .catch(err=>{
            throw err;
    })
    console.log("Reached test8")
    console.log(emailMatchResult)

    if (emailMatchResult) {
       
        console.log("reached test9")
            
        let email = person.email
        let password = person.password
        let  usersHashedPassword

        const queryHashedPassword = `
        MATCH (p:Person {email: '${email}'}) 
        RETURN p.password AS hashedPassword`

        await session.readTransaction((tx) => {
        return tx.run(queryHashedPassword)
        })
        .then(result => {
            console.log("before hashed passwrod reponse test")
            console.log("-----------------------------------")
            console.log(result.records[0])
            console.log(result.records[0]._fields[0])
            usersHashedPassword = result.records[0]._fields[0]
            return usersHashedPassword
        })
        .catch(err=>{
            throw err;
        })
        console.log("log it!")
        console.log(usersHashedPassword)

        await bcrypt.compare(password, usersHashedPassword, function(err, result) {
            if (err){
                throw err;
            }
            if (result){
                console.log("Correct password!")
            }else {
                console.log("wrong password!")
            }
        });
    } else {
        console.log("email not found!")
    }
}


function getUser(data, session) {
    console.log(data)

    const query = `
    match (p:Person {name:"${data.name}"})
    return p
    `
    console.log(query)

    return session.readTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log(response)
        return response.records
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
    match (p:Person {name:"${data.name}"})-[:${rel}]->(o:${outgoingNode})
    return o
    `

    console.log(query)

    return session.readTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log(response)
        return response.records
    }, error => {
        return error
    })
}

module.exports = {
    "createPerson": createPerson,
    "existingUser": existingUser,
    "loginUser": loginUser,
    "getUser": getUser, 
    "getUserRelations": getUserRelations
}