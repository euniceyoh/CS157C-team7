// Concert End Point

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

module.exports = {
    "createConcert": createConcert 
}
