// Getting DOM element
const concertNameField = document.querySelector("#concert-name");
const artistNameField = document.querySelector("#artist-name");
const locationField = document.querySelector("#location");
const dateField = document.querySelector("#date");
const files = document.querySelector("#image-url");
const creatBtn = document.querySelector("#create-btn"); // change to #update-btn
const spinner = document.querySelector("#spinner");

renderToDropDown("concert")
renderToDropDown("artist");
renderToDropDown("location");

// Fetch and render data to dropdown list
let rawData = {}
let result = {}
async function getDataFromDB(field){
    console.log(field)
    console.log("Hit")
    try{
        let res = await fetch(`api/v1/${field}`) 
        return await res.json();
    }catch(error){
        console.log(error)
    }
}

async function renderToDropDown(field){ 
    rawData = await getDataFromDB(field);

    result = Object.assign([], rawData); 
    console.log(result);
    for(let i = 0 ; i < result.length; i++){
        //console.log(result[i]['name']['properties']['name'])
        let option = document.createElement("option"); 
        if(field == 'concert') {
            let responseObj = result[i]['datetime']['properties']
            option.value = responseObj['name']
            option.text = responseObj['name']
            concertNameField.appendChild(option)
        }
        if(field === 'artist'){
            let responseObj = result[i]['name']['properties'];
            option.value = responseObj['name'];
            option.text = responseObj['name'];
            artistNameField.appendChild(option);
        }else if(field === 'location'){
            let responseObj = result[i]['country']['properties'];
            option.value = responseObj['city']+"/"+responseObj['state'];
            option.text =  responseObj['city']+"/"+responseObj['state'];
            locationField.appendChild(option);
        }
    }
}

// Update Button Handler
creatBtn.addEventListener("click", (e)=>{ // change to #update-btn
    e.preventDefault();
    const concert = updateConcert(); // change to updateConcert() 
    const artist = artistNameField.value;
    const location = locationField.value;

    if(concertValidation(concert)) {
        // create new artist or location if needed 
        if(concert.optionalArtist === true){
            const newArtist = {
                name: concert.artistName
            }
            postArtist(newArtist);
        }
        
        if(concert.optionalLocation === true){
            const newLocation = {
                city: concert.city,
                state: concert.state
            }
            postLocation(newLocation);
        }

        spinner.classList.remove("hidden")
        postConcert(concert); // can have empty fields 
        if(concert.city != "") // only if user selected location 
            postHasLocation({city:concert.city, state:concert.state, name:concert.name}) // should be unique i believe  
        if(concert.artistName != "") // only if user selected artist 
            postPerformConnection({artistName:concert.artistName, concertName:concert.name}) // should be unique i believe 

    } else {
        document.querySelector(".error-msg-1").classList.remove("hidden");
        setTimeout(()=>{document.querySelector(".error-msg-1").classList.add("hidden")}, 2000);
    }

    console.log(concert);
})

async function postConcert(concert){ 
    let body = JSON.stringify(concert)
    console.log(body)

    fetch("api/v1/concert/update",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: body
    })
    .then(response=> response)
    .then(data =>{
        console.log(data)
        alert(`Concert ${concertNameField.value} updated successfully!`);
        location.href=`http://localhost:3000/`
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

// Input Validation
const concertValidation = (concert) =>{
    let validConcert = false; 
    if(concert.name != undefined && concert.name != "" && concert.name != "Choose the Concert"){
        validConcert = true;
    }
    
    return validConcert
}

// Updating concert 
const updateConcert = () => {  
    const datetimeValue = new Date(dateField.value);
    const year_ = datetimeValue.getFullYear();
    const month_ = datetimeValue.getMonth()+1;
    const day_ = datetimeValue.getDate();
    const hour_ = datetimeValue.getHours();
    const minute_ = datetimeValue.getMinutes();

    let artistName_ = "";
    let optionalArtist_ = false;

    // artistNameField = artist dropdown 

    if(artistNameField.value === "Other" || artistNameField.value === undefined){
        artistName_ = document.querySelector("#new-artist").value
        optionalArtist_ = true;
    }else{
        artistName_ = artistNameField.value; // get new artist value 
    }

    let state_ = "";
    let city_ = "";
    let optionalLocation_ = false;
    if(locationField.value==="Other" || locationField.value === undefined){
        state_ = document.querySelector("#new-state").value; // get selected location 
        city_ = document.querySelector("#new-city").value;
        optionalLocation_ = true;
    }else{
        state_ = locationField.value.split("/")[1]; // get new location value 
        city_ = locationField.value.split("/")[0];
        optionalLocation_ = false;
    }

    console.log(artistNameField.value)
    console.log("artist: " + optionalArtist_)
    console.log(locationField.value)
    console.log("location: " + optionalLocation_)

    const submitObj = {
        name: document.querySelector("#concert-name").value, // should be query selector value 
        artistName:artistName_,
        year:year_,
        month:month_,
        day:day_,
        hour:hour_,
        minute:minute_,
        second: 0,

        state: state_,
        city:city_,
        concertImage: files.value,
        optionalArtist:optionalArtist_,
        optionalLocation:optionalLocation_
    }
    console.log(submitObj);
    return submitObj;
}

// can maybe refactor the code below since they are being reused  
async function postArtist(newArtist){ 
    fetch("api/v1/artist",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newArtist)
    })
    .then(response=> response)
    .then(data =>{
        console.log(data)
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

async function postPerformConnection(artistPerformsConcert){  
    fetch("api/v1/artist/perform",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(artistPerformsConcert)
    }).then(response=> response)
    .then(data =>{
        console.log(`${artistPerformsConcert} is created!`)
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

async function postLocation(newLocation){ 
    fetch("api/v1/location",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newLocation)
    })
    .then(response=> response)
    .then(data =>{
        console.log(`${newLocation.city} is created!`)
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

async function postHasLocation(locationAndConcertName){ 
    fetch("api/v1/location/locate",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(locationAndConcertName)
    })
    .then(response=> response)
    .then(data =>{
        console.log(`${locationAndConcertName} is created!`)
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}




