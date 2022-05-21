const artistNameField = document.querySelector("#artist-name");
const creatBtn = document.querySelector("#create-btn");

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
        alert(`Artist ${newArtist.name} was added successfully!`);
        location.href=`http://localhost:3000/`
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

creatBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    const artist = artistNameField.value;
    if(artist!= "" && artist != undefined){
        postArtist({name:artist})
    }
})