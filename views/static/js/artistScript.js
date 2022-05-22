const futureConcertField = document.querySelector("#future-concert");
const artistName = document.querySelector("#artist-name").innerHTML;
const pastConcertField = document.querySelector("#past-concert");
const favoriteBtn = document.querySelector("#fav-btn");
const artistImg = document.querySelector("#artist-img");

const UserObj = {user: "Can", artist_name: artistName} 
let rawData = {}
let result = {}
console.log(artistName)
printArtist();
printFavorite()
printConcerts("future-concert");
printConcerts("past-concert");

async function getArtist(){
    try{
        let res = await fetch(`/api/v1/artist/${UserObj.artist_name}`)
        return await res.json();
    }catch(error){
        console.log(error)
    }
}

async function printArtist(){
    let fetchResult = await getArtist();
    if('url' in fetchResult[0]["name"]["properties"]){
        artistImg.setAttribute("src", fetchResult[0]["name"]["properties"]["url"])
    }
    
}


async function getConcerts(time){
    console.log("Hit")
    try{
        let res = await fetch(`/api/v1/concert/${time}/${artistName}`)
        return await res.json();
    }catch(error){
        console.log(error)
    }
}

async function getFavorite(){
    try{
        let res = await fetch(`/api/v1/artist/is-favorite/?user=${UserObj.user}&artist_name=${UserObj.artist_name}`)
        return await res.json();
    }catch(error){
        console.log(error)
    }
}

async function printFavorite(){
    let fetchResult = await getFavorite();
    let favorite = fetchResult[0]["_fields"][0];
    if(favorite){
        favoriteBtn.innerHTML = 'Un-Favorite'
    }else{
        favoriteBtn.innerHTML = 'Favorite'
    }
}

async function printConcerts(time){
    rawData = await getConcerts(time);
    console.log(sortConcertInDateOrder(rawData));
    result = Object.assign([], rawData);
    result = sortConcertInDateOrder(result);
    console.log(result);
    let appendedField = undefined;
    if(time ==="future-concert"){
        appendedField =  futureConcertField;
    }else if(time === "past-concert"){
       appendedField = pastConcertField
    }else{
        return;
    }


    const lengthOfLoop = Math.min(result.length, 3);
    if(lengthOfLoop === 0){
        appendedField.innerHTML += "Nothing Found!";
    }
  
    for(let i = 0; i < lengthOfLoop ; i++){
        const concertProps = result[i]
        const concertURL = `/concert/${concertProps["name"]}`
        const concertDate = concertProps["date"]
        const concert = 
        `
        <a href="${concertURL}" class="w-1/3 md:w-1/3 p-4">
            <div class="bg-gray-100 p-6 rounded-lg">
                <img class="h-20 rounded w-full object-contain object-center mb-6" src="${concertProps["url"]}" alt ="concert"}>
                <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">${concertProps["name"]}</h3>
                <h3 class="tracking-widest text-gray-800 text-xs font-small title-font">${concertDate}</h3>
            </div>
        </a>
        `
        appendedField.innerHTML += concert;
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

favoriteBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(favoriteBtn.innerHTML === "Favorite"){
        postFavoriteArtist();
        // favoriteBtn.innerHTML = "Un-Favorite"
    }else{
        // pos
    }
})

const postFavoriteArtist = async () =>{
    fetch(`/api/v1/artist/favorite`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UserObj)
    })
    .then(response=> response)
    .then(data =>{
        alert(`Artist ${UserObj.artist_name} was favorited successfully!`);
        favoriteBtn.innerHTML = "Un-Favorite"
        // location.href=`http://localhost:3000/`
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}