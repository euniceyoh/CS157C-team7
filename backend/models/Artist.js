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


module.exports = {
    "getAll": getAll
}