

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
    "getUser": getUser, 
    "getUserRelations": getUserRelations
}