const artistNameField = document.querySelector("#artist-name");
const submitBtn = document.querySelector("#submit-btn");
const imageURLField = document.querySelector("#image-url");

// Fetch and render data to dropdown list
let rawData = {}
let result = {}
async function getDataFromDB(){
    console.log("Hit")
    try{
        let res = await fetch(`api/v1/artist`)
        return await res.json();
    }catch(error){
        console.log(error)
    }
}

async function renderToDropDown(){
    rawData = await getDataFromDB();
    result = Object.assign([], rawData);
    console.log(result);
    for(let i = 0 ; i < result.length; i++){
        let option = document.createElement("option");
        let responseObj = result[i]['name']['properties'];
        option.value = responseObj['name'];
        option.text = responseObj['name'];
        artistNameField.appendChild(option);
    }
}

renderToDropDown();

submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(inputValidation()){
        const artistObj = {
            name:artistNameField.value,
            url:imageURLField.value
        }
        putArtist(artistObj);

    }

})

const putArtist = (artist) =>{
    fetch(`/api/v1/artist/${artist.name}`,{
        method:"PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(artist)
    })
    .then(response=> response)
    .then(data =>{
        alert(`Artist ${artist.name} was updated successfully!`);
        location.href=`http://localhost:3000/`
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

const inputValidation = () =>{
    const targetArtist = artistNameField.value;
    const newURL = imageURLField.value;
    let validArtist = false;
    let validUrl = false;

    if(targetArtist != undefined && targetArtist != ''){
        validArtist = true;
    }
    if(newURL != undefined && newURL != ''){
        validUrl = true;
    }

    return validArtist && validUrl;

}