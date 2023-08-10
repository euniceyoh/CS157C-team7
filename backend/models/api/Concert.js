const Concert = require("../schema/Concert");
const Person = require("../schema/Person");

function getAllConcerts(session) {
    const query = `
    MATCH (concert:Concert) RETURN concert
    `
    console.log(query)
    return session.readTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        return parseConcert(response)
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

function deleteConcert (concert, session) {
    console.log(concert) // body needs to use name 
    
    const query = `
    MATCH (c {name: '${concert.name}'}) DETACH DELETE c
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

function createConcert(concert, session) { 
    console.log(concert.datetime);
    const date = `datetime({year: ${concert.datetime.year},month: ${concert.datetime.month},day: ${concert.datetime.day}, hour: ${concert.datetime.hour},minute: ${concert.datetime.minute}, second: ${concert.datetime.second}})`
    const query = `
    Create(concert:Concert{
        name:"${concert.name}", 
        url: "${concert.url}",
        concert_date: ${date}
    })`
    console.log(query);
    // tx either succeeds or fails       timezone: "${concert.datetime.timezone}"
    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log(response)
        return response.records
    }, error => {
        console.log(error)
        return error
    })
}

function updateConcert(concert, session) {
    // fields to update: date, url 
    console.log(concert)
    let query = `MATCH (c:Concert {name: "${concert.name}"})`
    let prevSet = false

    if(concert.datetime != null) {
        // update date 
        const date = `datetime({year: ${concert.datetime.year},month: ${concert.datetime.month},day: ${concert.datetime.day}, hour: ${concert.datetime.hour},minute: ${concert.datetime.minute}, second: ${concert.datetime.second}})`
        query += ` SET c.concert_date = ${date}`
        prevSet = true
    }
    if(concert.url != '') {
        // update url 
        if(prevSet)
            query += `, c.url = "${concert.url}"`
        else
            query += ` SET c.url = "${concert.url}"`
    }
    query += ` return c`
    console.log(query)

    return session.writeTransaction((tx) => {
        return tx.run(query)
    })
    .then(response => {
        console.log(response)
        return response.records
    }, error => {
        console.log(error)
        return error 
    })
}

// Concert Lookup Endpoint
const searchConcertWithFilter = (concert_category, session) => {
    const numberOfparametes = Object.keys(concert_category).length;
    let query = "";
    if(numberOfparametes === 1){
        query = queryForUpcomingConcert(concert_category)
    }else if(numberOfparametes === 2){
        query = queryConcertWithFilterBuilder(concert_category);
    }else{
        query = queryConcertWithAllFilterBuilder(concert_category);
    }

    console.log(query);
    
    return session.readTransaction(
        (tx) => tx.run(query)
        ).then(parseConcert);
}

const parseConcert = (result) =>{
    return result.records.map(r => new Concert(r.get('concert')));
}

// query base on the concert name only
const queryForUpcomingConcert = (concert_category)=>{
    const query = `
        MATCH (concert : Concert)
        WHERE concert.name CONTAINS "${concert_category.name}"  
        RETURN concert
    `
    return query;
}

// Query base on the concert name AND (artist or city)
const queryConcertWithFilterBuilder = (concert_category) =>{
    let optionalCondition = "";
    let prefixBuilder = "";

    if("artistName" in concert_category && concert_category["artistName"] !== "" && concert_category["artistName"] !== null){
            optionalCondition +=`AND (concert)<-[:PERFORMS]-(artist {name: ${concert_category["artistName"]}})`;
            prefixBuilder += `,(artist : Artist)`;
        }
        if("city" in concert_category && concert_category["city"] !== "" && concert_category["city"] !== null){
            optionalCondition += `AND (concert)-[:HAS_LOCATION]->(location { city: ${concert_category["city"] } })`;
            prefixBuilder += `,(location : Location)`;
        }

    const query = `
    MATCH (concert : Concert) ${prefixBuilder}
    WHERE concert.name CONTAINS "${concert_category.name}" AND concert.concert_date >= datetime() 
    ${optionalCondition}
    RETURN concert
    `;

    return query;
}

const queryConcertWithAllFilterBuilder = (concert_category) =>{
    const query = `
    MATCH (concert : Concert), (artist : Artist), (location : Location)
    WHERE concert.name CONTAINS "${concert_category.name}" AND concert.concert_date >= datetime() 
    AND (concert)<-[:PERFORMS]-(artist {name: ${concert_category["artistName"]}})
    AND (concert)-[:HAS_LOCATION]->(location { city: ${concert_category["city"] } })
    RETURN concert
    `;
    return query;
}

const filterAttendees = (filters, session) => {
    // prefixBuilder will initialize variables that are used in the query
    // Below variables are optional and they will be empty if user didn't specify additional features
    console.log("called filterAttendees()" + JSON.stringify(filters))
    let optionalCondition = ""

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

const queryFutureConcertOfArtist = (artistName, session) =>{
    console.log(artistName);

    const query = 
    `
    MATCH (artist:Artist{name:"${artistName}"})-[:PERFORMS]->(concert:Concert)
    WHERE concert.concert_date >= datetime() 
    RETURN concert
    `
    console.log(query)
    return session.readTransaction(
        (tx) => tx.run(query)
        ).then(parseConcert)
   
}

const queryPastConcertOfArtist = (artistName, session) =>{
    console.log(artistName);

    const query = 
    `
    MATCH (artist:Artist{name:"${artistName}"})-[:PERFORMS]->(concert:Concert)
    WHERE concert.concert_date < datetime() 
    RETURN concert
    `
    console.log(query)
    return session.readTransaction(
        (tx) => tx.run(query)
        ).then(parseConcert)
   
}

const parseAttendees = (result) =>{
    
    return result.records.map(r => new Person(r.get('person')));
}

module.exports = {
    "updateConcert": updateConcert, 
    "getAllConcerts": getAllConcerts, 
    "createConcert": createConcert,
    "deleteConcert": deleteConcert, 
    "searchConcertWithFilter": searchConcertWithFilter,
    "searchAttendees": filterAttendees,
    "addNewAttendConcert": addNewAttendConcert,
    "attendeeExists": checkWillAttendRelExists, 
    "deleteAttendConcert": deleteAttendConcert,
    "getConcertLocation": getConcertLocation,
    "futureConcertOfArtist": queryFutureConcertOfArtist,
    "pastConcertOfArtist":queryPastConcertOfArtist

}
