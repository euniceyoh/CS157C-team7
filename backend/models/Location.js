const Location = require("./schema/Location");

const getAll = (session) => {
    return session.readTransaction (
        txc => txc.run(`MATCH (n:Location) RETURN n`)
    ).then(parseLocation);
}

const create = (location, session) =>{
    const query =
    `
    CREATE (n:Location{
        country:"${location.country}",
        city:"${location.city}",
        state:"${location.state}"
    })
    `
    console.log(query)
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

const hasLocation = (location, concertName, session) =>{
    const query = 
    `
    MATCH 
    (location:
        Location{country:"United States of America",city:"${location.city}", state:"${location.state}"}), 
    (concert:
        Concert{name:"${concertName}"})

    CREATE (concert)-[r:HAS_LOCATION]->(location)
    return type(r)
    `
    console.log(query)
    
    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log(response)
        return response.records
    }, error => {
        return error
    })
}

const parseLocation = (result) =>{
    return result.records.map(r => new Location(r.get('n')));
}

module.exports = {
    "getAll":getAll,
    "create":create,
    "hasLocation":hasLocation
}