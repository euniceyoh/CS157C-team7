
// Person End Point
const Person = require("./schema/Person");

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

    console.log("before query test")
    console.log(query)
    console.log("after query test")

    return session.readTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log("before reponse test")
        console.log(response)
        console.log("after reponse test")
        console.log("------------------")
        console.log(response.records)

        return response.records
    }, error => {
        return error
    })
}

// function createPerson(person, session) {
//     return session.run('MATCH (person:Person {email: {email}}) RETURN person', {
//             email: email
//         })
//         .then(results => {
//             if (!_.isEmpty(results.records)) {
//                 throw {
//                     email: 'Email already in use',
//                     status: 400
//                 }
//             }
//             else {
//                 return session.run('CREATE (person:Person {id: {id}, email: {email}, name: {name}, gender: {gender}, dob: {dob}, imgurl: {imgurl} ,password: {password}, api_key: {api_key}}) RETURN person', {
//                     id: uuid.v4(),
//                     name: name,
//                     email: email,
//                     gender: gender,
//                     dob: dob,
//                     imgurl: imgurl,
//                     password: hashPassword(email, password),
//                     api_key: randomstring.generate({
//                         length: 20,
//                         charset: 'hex'
//                     })
//                 }).then(results => {
//                     return new Person(results.records[0].get('person'));
//                 })
//             }
//         });
// };



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
    "getUser": getUser, 
    "getUserRelations": getUserRelations
}