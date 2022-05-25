const artistNameField = document.querySelector("#artist-name");

const searchBtn = document.querySelector("#search-btn");
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")

searchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    console.log("Clicked!")
    userCardContainer.innerHTML = '';
    const targetArtist = artistNameField.value;
    if(targetArtist != '' && targetArtist != undefined){
        const url = `/api/v1/artist/${targetArtist}`
        getArtist(url)
    }
})

async function getArtist(url_){
    console.log(url_)
    fetch(url_)
      .then(response => response.json())
      .then(data => {
        if(data.length === 0){
          userCardContainer.innerHTML = 'No Artist Found!';
        }else{
            console.log(data)
          data.forEach(record => console.log(record["name"]['properties']['name']))

          users = data.map(user => {
              const artistName = user["name"]['properties']['name']
            const card = userCardTemplate.content.cloneNode(true).children[0]
            const header = card.querySelector("[data-header]")
            header.textContent = user["name"]['properties']['name']
            const concertFullName = header.textContent;

                card.setAttribute("href",`artist/${artistName}`)

            userCardContainer.append(card)
            return { name: user["name"]['properties']['name'], element: card }
          })
        }
      })
}