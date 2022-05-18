'use strict';

const Artist = require("./schema/Artist");


const getAll = (session) => {
    return session.readTransaction (
        txc => txc.run(`MATCH (artist:Artist) RETURN artist`)
    ).then(parseArtists);
}

const parseArtists = (result) =>{
    return result.records.map(r => new Artist(r.get('artist')));
}

const createArtist = (artist, session) =>{
    const query = 
    `
    CREATE (artist:Artist{
        name:"${artist.name}"
    })
    `
    console.log(query)
    return session.writeTransaction((tx) => 
        tx.run(query) 
    )
    .then(result => { // returns a promise 
        return result.summary
    }, error => {
        return error
    })
}

const performs = (artistName, concertName, session)=>{
    console.log(artistName+" "+concertName);

    const query = 
    `
    MATCH (artist:Artist{name:"${artistName}"}), (concert:Concert{name:"${concertName}"})
    
    CREATE (artist)-[r:PERFORMS]->(concert)
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

module.exports = {
    "getAll": getAll,
    "perfoms": performs,
    "create":createArtist
}