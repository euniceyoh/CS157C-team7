// Concert End Point

const { response } = require("express");
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

function checkWillAttendRelExists(data, session) {
    let user = data.name
    let concert = data.concert

    const query = `
    RETURN EXISTS
    ((:Person {name: '${user}'})-[:WILL_ATTEND]-(:Concert {name:'${concert}'}))`

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

function addNewAttendConcert(data, session) { 
    console.log(data)

    const query = `
    match (p:Person {name: "${data.user}"}), (c:Concert {name: "${data.concert}"})
    create (p)-[r:WILL_ATTEND]->(c)
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

function deleteAttendConcert(data, session) {
    console.log(data)
    const query = `
    match (:Person {name:'${data.user}'})-[r:WILL_ATTEND]-(:Concert {name:'${data.concert}'})
    delete r
    `
    console.log(query)

    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log(response)
        return response
    }, error => {
        return error
    })
}

function getConcertLocation(data, session) {
    console.log(data)

    const query = `
    match (n:Concert{name:"${data.concert}"})-[:HAS_LOCATION]-(location)
    return location
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
    console.log("filter concert: " + query);

    return session.readTransaction(
        (tx) => tx.run(query)
        ).then(parseConcert);
}

const parseConcert = (result) => {
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
            optionalConditionList.push(`(concert)<-[:PERFORMS]-(artist {name: "${concert_category[category]}"})`);
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

const filterAttendees  = (filters, session) => {
    // prefixBuilder will initialize variables that are used in the query
    // Below variables are optional and they will be empty if user didn't specify additional features
    console.log("filterAttendees" + JSON.stringify(filters))
    let optionalCondition = ""

    console.log("filters: ")
    for(let filter in filters) {
        console.log(filter)
        let date = filters["date"]
        let gender = filters[filter]
        
        if(filter == "date" && date != "") {
            console.log(date) 
            // parse date '18to25' 
            let range = date.split('to')
            //console.log(range[0])
            let start = 2022 - parseInt(range[1])
            let end = 2022 - parseInt(range[0])
            //console.log(start + " " + end)
            optionalCondition += `AND ((person.Date >= ${start}) AND (person.Date <= ${end}))`
        }
        if(filter == "gender" && gender != "") {
            optionalCondition += `\n AND ((person.gender = "${gender}"))`
        }
    }
    
    const query = 
    `
    MATCH (person : Person), (concert : Concert)
    WHERE concert.name CONTAINS "${filters.name}" 
    AND ((person)-[:HAS_ATTENDED]->(concert) OR (person)-[:WILL_ATTEND] ->(concert))
    ${optionalCondition}
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
    "addNewAttendConcert": addNewAttendConcert,
    "attendeeExists": checkWillAttendRelExists, 
    "deleteAttendConcert": deleteAttendConcert,
    "getConcertLocation": getConcertLocation
}
