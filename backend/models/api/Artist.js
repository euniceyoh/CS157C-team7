// contains the actual cypher queries, contains the functions used in routes 

'use strict';

const Artist = require("../schema/Artist");

const getAll = (session) => {
    return session.readTransaction ( // readTransaction signals to driver i want to read data
        txc => txc.run(`MATCH (artist:Artist) RETURN artist`)
        // passing in a function that performs work of transaction 
        // useful since i might write multiple queries, in which i want all to succeed or none 
        // https://community.neo4j.com/t/difference-between-session-run-and-session-readtransaction-or-session-writetransaction/14720/6
    ).then(parseArtists); // attach a callback with the data returned 
}

const getArtist = (artistName, session) => {
    return session.readTransaction (
        txc => txc.run(`MATCH (artist:Artist{name:"${artistName}"}) RETURN artist`)
    ).then(parseArtists);
}

const parseArtists = (result) =>{
    return result.records.map(r => new Artist(r.get('artist')));
}

const createArtist = (artist, session) =>{
    const query = 
    `
    CREATE (artist:Artist{name:"${artist.name}", url:"${artist.url}"})
    `
    // this is an async function 
    return session.writeTransaction((tx) => 
        tx.run(query) 
    )
    .then(result => {  
        return result.summary
    }, error => {
        return error
    })
}

const performsConnection = (artistName, concertName, session)=>{
    const query = 
    `
    MATCH (artist:Artist{name:"${artistName}"}), (concert:Concert{name:"${concertName}"})
    
    CREATE (artist)-[r:PERFORMS]->(concert)
    return type(r)
    `
    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        return response.records
    }, error => {
        return error
    })
}

const search = (artistName, session) =>{
    const query = 
    `
    MATCH (artist:Artist{
        name: "${artistName}"
        })
        return artist
    `
    return session.readTransaction (txc => txc.run(query))
    .then(parseArtists);
}

const favorite = (userName, artistName, session) =>{
    const query = `
    match (p:Person {name: "${userName}"}), (artist:Artist {name: "${artistName}"})
    create (p)-[r:FAVORITES]->(artist)
    return type(r)
    `
    return session.writeTransaction((tx) => { return tx.run(query) })
    .then(response => {
        return response.records
    }, error => {
        return error
    })
}

const unfavorite = (userName, artistName, session) =>{
    const query = `
    match (p:Person {name: "${userName}"})-[r:FAVORITES]->(artist:Artist {name: "${artistName}"})
    delete r
    `
    return session.writeTransaction((tx) => { return tx.run(query)})
    .then(response => {
        return response.records
    }, error => {
        return error
    })
}

const isFavorite = (userName, artistName, session) =>{
    const query = `
    RETURN EXISTS
    ((:Person {name: '${userName}'})-[:FAVORITES]->(:Artist {name:'${artistName}'}))`

    return session.readTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        return response.records
    }, error => {
        return error
    })
}

const deleteArtist = (artistName, session)=>{
    const query = `
    match (artist:Artist {name: "${artistName}"})
    detach delete artist
    `
    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        return response.records
    }, error => {
        return error
    })
}

const updateArtist = (artistName, newUrl, session) =>{
    const query = `
    match (artist:Artist {name: "${artistName}"})
    set artist.url ="${newUrl}"
    return artist
    `
    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        return response.records
    }, error => {
        return error
    })
}

module.exports = {
    "getAll": getAll,
    "getArtist":getArtist,
    "perfoms": performsConnection,
    "create":createArtist,
    "search":search,
    "favorite":favorite,
    "unfavorite":unfavorite,
    "isFavorite":isFavorite,
    "delete":deleteArtist,
    "update":updateArtist,
}