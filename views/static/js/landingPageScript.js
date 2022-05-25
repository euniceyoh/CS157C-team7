const searchBtn = document.querySelector("#search-btn");

const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const concertNameField = document.querySelector("#concert-name");
searchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const concertName = concertNameField.value;
    userCardContainer.innerHTML = '';
    if(concertName !== '' && concertName !==null){

        let url_ = `api/v1/concert/filter/?name=${concertName}`
        getConcert(url_);
      }else{
        console.log("Input required!")
      }
})

async function getConcert(url_) {
    console.log(url_)
    fetch(url_)
      .then(response => response.json())
      .then(data => {
        data.forEach(record => console.log(record["datetime"]['properties']['concert_date']))

        users = data.map(user => {
          const card = userCardTemplate.content.cloneNode(true).children[0]
          const header = card.querySelector("[data-header]")
          header.textContent = user["datetime"]['properties']['name']
          const concertFullName = header.textContent;
          console.log(`concert&name=${concertFullName}`)
          card.setAttribute("href",`concert/${concertFullName}`)
          userCardContainer.append(card)
          return { name: user["datetime"]['properties']['name'], element: card }
        })
      })
  }