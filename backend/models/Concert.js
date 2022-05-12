// Concert End Point

const Concert = require("./schema/Concert");
const Person = require("./schema/Person");

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
    console.log(concert_category)

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
    let optionalConditionList = [];
    for (let category in concert_category) {
        if(category === "name" ){
            continue;
        }
        if(category === "artistName" && concert_category[category] !== "" && concert_category[category] !== null){
            console.log(concert_category[category])
            optionalConditionList.push(`(concert)<-[:PERFORMS]-(artist {name: ${concert_category[category]}})`);
            prefixBuilder += `,(artist : Artist)`;
        }
        if(category === "city" && concert_category[category] !== "" && concert_category[category] !== null){
            optionalConditionList.push(`(concert)-[:HAS_LOCATION]->(location {city:${concert_category[category]}})`);
            prefixBuilder += `,(location : Location)`;
        }
    }

    optionalConditionList.forEach(option => optionalCondition +=` AND ${option}`);

    return [optionalCondition, prefixBuilder];
}

const filterAttendees  = (concert_category, session) => {

    // prefixBuilder will initialize variables that are used in the query
    // Below variables are optional and they will be empty if user didn't specify additional features
    console.log(concert_category)

    const query = `
    MATCH (person : Person), (concert : Concert)
    WHERE concert.name CONTAINS "${concert_category.name}" 
    AND ( 
            (person)-[:HAS_ATTENDED]->(concert)
        OR  (person)-[:WILL_ATTEND] ->(concert)
        )
    RETURN person;
    `;
    console.log(query);

    return session.readTransaction(
        (tx) => tx.run(query)
        ).then(parseAttendees);
}

const parseAttendees = (result) =>{
    return result.records.map(r => new Person(r.get('person')));
}
module.exports = {
    "createConcert": createConcert ,
    "searchConcert": filterConcert,
    "searchAttendees": filterAttendees,
}