// Concert End Point

const { session } = require("neo4j-driver");
const Concert = require("./schema/Concert");
const Person = require("./schema/Person");

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

function createConcert(concert, session) { 
    // Create(concert:Concert{
    //     name:"testInCLI",
    //     concert_date:datetime({
    //         year:2022,
    //         month:7,
    //         day:1,
    //         hour:18,
    //         minute:0,
    //         second:0
    //     }),
    //     url:"https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png"
    // })

    console.log(concert.datetime);
    const query = `Create(concert:Concert{
        name:"${concert.name}", 
        concert_date: datetime({
            year: ${concert.datetime.year}, 
            month: ${concert.datetime.month}, 
            day: ${concert.datetime.day}, 
            hour: ${concert.datetime.hour}, 
            minute: ${concert.datetime.minute},
             
            second: ${concert.datetime.second}
        }),
        url: "${concert.url}"
    })`
        console.log(query)
    // tx either succeeds or fails       timezone: "${concert.datetime.timezone}"
    return session.writeTransaction((tx) => 
        tx.run(query) 
    )
    .then(result => { // returns a promise 
        return result.summary
    }, error => {
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

// Query base on the concert name only
const queryForUpcomingConcert = (concert_category)=>{
    const query = `
        MATCH (concert : Concert)
        WHERE concert.name CONTAINS "${concert_category.name}" AND concert.concert_date >= datetime() 
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
    "createConcert": createConcert,
    "searchConcertWithFilter": searchConcertWithFilter,
    "searchAttendees": filterAttendees,
    "addNewAttendConcert": addNewAttendConcert,
    "attendeeExists": checkWillAttendRelExists, 
    "deleteAttendConcert": deleteAttendConcert,
    "getConcertLocation": getConcertLocation
}
