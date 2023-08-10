// Getting DOM element
const concertNameField = document.querySelector("#concert-name");
const artistNameField = document.querySelector("#artist-name");
const locationField = document.querySelector("#location");
const dateField = document.querySelector("#date");
const files = document.querySelector("#image-url");
const creatBtn = document.querySelector("#create-btn");
const spinner = document.querySelector("#spinner");

// Fetch and render data to dropdown list
let rawData = {}
let result = {}
async function getDataFromDB(field){
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

renderToDropDown("artist");
renderToDropDown("location");


async function postConcert(concert){
    fetch("api/v1/concert",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(concert)
    })
    .then(response=> response)
    .then(data =>{
        alert(`Concert ${concertNameField.value} added successfully!`);
        location.href=`http://localhost:3000/`
    })
    .catch((error) => {
        console.error('Error:', error);
      });
      postPerformConnection({artistName:concert.artistName, concertName:concert.name})
 
}

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

// Creating a new "Concert"
const createNewConcert = () =>{
    const datetimeValue = new Date(dateField.value);
    const year_ = datetimeValue.getFullYear();
    const month_ = datetimeValue.getMonth()+1;
    const day_ = datetimeValue.getDate();
    const hour_ = datetimeValue.getHours();
    const minute_ = datetimeValue.getMinutes();

    let artistName_ = "";
    let optionalArtist_ = false;
    if(artistNameField.value === "Other" ||artistNameField.value === "" || artistNameField.value === undefined){
        artistName_ = document.querySelector("#new-artist").value;
        optionalArtist_ = true;
    }else{
        artistName_ = artistNameField.value;
        optionalArtist_ = false;
    }

    let state_ = "";
    let city_ = "";
    let optionalLocation_ = false;
    if(locationField.value==="Other" || locationField.value === "" || locationField.value === undefined){
        state_ = document.querySelector("#new-state").value;
        city_ = document.querySelector("#new-city").value;
        optionalLocation_ = true;
    }else{
        state_ = locationField.value.split("/")[1];
        city_ = locationField.value.split("/")[0];
        optionalLocation_ = false;
    }

    const submitObj = {
        name: concertNameField.value,
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


// Submit Button Handler
creatBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const concert = createNewConcert();
    const artist = artistNameField.value;
    const location = locationField.value;

    if(!optionalFieldValidation("artist", artist)){
        document.querySelector(".error-msg-1").classList.remove("hidden");
        setTimeout(()=>{document.querySelector(".error-msg-1").classList.add("hidden")}, 2000);
        
    }
    if(!optionalFieldValidation("city", location)||!optionalFieldValidation("state", location)){
        document.querySelector(".error-msg-2").classList.remove("hidden")
        setTimeout(()=>{document.querySelector(".error-msg-2").classList.add("hidden")}, 2000);
    }

    if(postValidation(concert) ){
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
        postConcert(concert);
        postHasLocation({city:concert.city, state:concert.state, name:concert.name})
    }

    console.log(concert);
})

// Input Validation
const postValidation = (concert) =>{
    let validArtist = false;
    let validCity = false;
    let validState = false;
    if(concert.artistName != undefined && concert.artistName != "" && concert.artistName != "Other"){
        validArtist = true;
    }
    if(concert.city != undefined && concert.city != "" ){
        validCity = true;
    }
    if(concert.state != undefined && concert.state != ""){
        validState = true;
    }
    return validArtist && validCity && validState;
}

const optionalFieldValidation = (key, value) =>{
    const optionalField = document.querySelector(`#new-${key}`);

    return (value === 'Other' || value === "")  && (optionalField.value === '' || optionalField.value === undefined)? false : true;
}
