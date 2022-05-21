const futureConcertField = document.querySelector("#future-concert");

const pastConcertField = document.querySelector("#past-concert");
let rawData = {}
let result = {}

printConcerts("future-concert");
printConcerts("past-concert");

async function getConcerts(time){
    const artistName ="Jack Harlow" 

    console.log("Hit")
    try{
        let res = await fetch(`/api/v1/concert/${time}/${artistName}`)
        return await res.json();
    }catch(error){
        console.log(error)
    }
}

async function printConcerts(time){
    rawData = await getConcerts(time);
    console.log(sortConcertInDateOrder(rawData));
    result = Object.assign([], rawData);
    result = sortConcertInDateOrder(result);
    console.log(result);
    const lengthOfLoop = Math.min(result.length, 3);
    for(let i = 0; i < lengthOfLoop ; i++){
        const concertProps = result[i]
        const concertURL = `/concert/${concertProps["name"]}`
        const concert = 
        `
        <a href="${concertURL}" class="xl:w-1/3 md:w-1/3 p-4">
            <div class="bg-gray-100 p-6 rounded-lg">
                <img class="h-40 rounded w-full object-cover object-center mb-6" src="${concertProps["url"]}" alt="content">
                <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">${concertProps["name"]}</h3>
                <h3 class="tracking-widest text-gray-800 text-xs font-small title-font">Date</h3>
            </div>
        </a>
        `
        if(time ==="future-concert"){
            futureConcertField.innerHTML += concert;
        }else if(time === "past-concert"){
            pastConcertField.innerHTML += concert;
        }
        
    }
}

const sortConcertInDateOrder =  (rawData) => {
    const result1 = []
    for(let i = 0; i < rawData.length; i++){
        const concertObj = {}
        const concertProps = rawData[i]["datetime"]["properties"]
        concertObj["name"] = concertProps["name"]
        concertObj["date"] = new Date(
                                concertProps["concert_date"]["year"]['low'],
                                concertProps["concert_date"]["month"]["low"], 
                                concertProps["concert_date"]["day"]['low'],
                                concertProps["concert_date"]["hour"]['low'],
                                concertProps["concert_date"]["minute"]['low'],
                                concertProps["concert_date"]["second"]['low'],
                                0
                                 );
        concertObj["url"] = concertProps["url"];
        result1.push(concertObj);
    }

    result1.sort((a,b)=> a["date"] - b["date"]);
    return result1;
}


