// Concert End Point

const Concert = require("./schema/Concert")

function createConcert(concert, session) { 

    const query = `CREATE (concert: Concert{
        name:"${concert.name}", 
        concert_date: datetime({
            year: ${concert.datetime.year}, 
            month: ${concert.datetime.month}, 
            day: ${concert.datetime.day}, 
            hour: ${concert.datetime.hour}, 
            minute: ${concert.datetime.minute}, 
            second: ${concert.datetime.second}, 
            timezone: "${concert.datetime.timezone}"
    })})`

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

const filterConcert = (concert_category, session) => {

    // prefixBuilder will initialize variables that are used in the query
    // Below variables are optional and they will be empty if user didn't specify additional features
    let [ optionalCondition, prefixBuilder ] = queryConcertBuilder(concert_category);

    if(optionalCondition.length !== 0){
        optionalCondition = `AND ${optionalCondition}`;
    }

    const query = `
    MATCH (concert : Concert) ${prefixBuilder}
    WHERE concert.name CONTAINS "${concert_category.name}" 
    ${optionalCondition}
    RETURN concert
    `;
    console.log(query);

    return session.readTransaction(
        (tx) => tx.run(query)
        ).then(parseConcert);
}

const parseConcert = (result) =>{
    return result.records.map(r => new Concert(r.get('concert')));
}

const queryConcertBuilder = (concert_category) =>{
    let optionalCondition = "";
    let prefixBuilder = "";

    for (let category in concert_category) {
        if(optionalCondition.length != 0){
            optionalCondition+=" AND ";
        }
        if(category === "name"){
            continue;
        }
        if(category === "artistName"){
            optionalCondition += `(concert)<-[:PERFORMS]-(artist {name: "${concert_category[category]}"})`;
            prefixBuilder += `,(artist : Artist)`;
        }
        if(category === "city"){
            optionalCondition += `(concert)-[:HAS_LOCATION]->(location {city:"${concert_category[category]}"})`;
            prefixBuilder += `,(location : Location)`;
        }
    }
    return [optionalCondition, prefixBuilder];
}

module.exports = {
    "createConcert": createConcert ,
    "searchConcert": filterConcert,
}