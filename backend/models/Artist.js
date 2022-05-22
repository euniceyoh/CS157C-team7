'use strict';

const session = require("express-session");
const Artist = require("./schema/Artist");


const getAll = (session) => {
    return session.readTransaction (
        txc => txc.run(`MATCH (artist:Artist) RETURN artist`)
    ).then(parseArtists);
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

const performsConnection = (artistName, concertName, session)=>{
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

const search = (artistName, session) =>{
    console.log(artistName);
    const query = 
    `
    MATCH (artist:Artist{
        name: "${artistName}"
        })
        return artist
    `
    console.log(query);

    return session.readTransaction (
        txc => txc.run(query)
    ).then(parseArtists);
}

const favorite = (userName, artistName, session) =>{
    console.log(userName+" "+artistName);
    const query = `
    match (p:Person {name: "${userName}"}), (artist:Artist {name: "${artistName}"})
    create (p)-[r:FAVORITES]->(artist)
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

const unfavorite = (userName, artistName, session) =>{
    console.log(userName+" "+artistName);
    const query = `
    match (p:Person {name: "${userName}"}), (artist:Artist {name: "${artistName}"})
    delete r
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

const isFavorite = (userName, artistName, session) =>{
    console.log(userName + " "+ artistName);

    const query = `
    RETURN EXISTS
    ((:Person {name: '${userName}'})-[:FAVORITES]->(:Artist {name:'${artistName}'}))`

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
    "getAll": getAll,
    "getArtist":getArtist,
    "perfoms": performsConnection,
    "create":createArtist,
    "search":search,
    "favorite":favorite,
    "unfavorite":unfavorite,
    "isFavorite":isFavorite,
}