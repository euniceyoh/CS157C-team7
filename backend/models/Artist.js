'use strict';

const Artist = require("./schema/Artist");


const getAll = (session) => {
    return session.readTransaction (
        txc => txc.run(`MATCH (n:Artist) RETURN n LIMIT 25`)
    ).then(parseArtists);
}

const parseArtists = (result) =>{
    return result.records.map(r => new Artist(r.get('n')));
}

const performs = (artistName, concertName, session)=>{
    const query = 
    `
    MATCH (artist:Artist{name:${artistName}}), (concert:Concert{name:${concertName}})
    CREATE (artist)-[r:PERFORMS]->(concert)
    return type(r)
    `
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

module.exports = {
    "getAll": getAll,
    "perfoms": performs
}