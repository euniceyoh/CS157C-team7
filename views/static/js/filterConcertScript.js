
    const userCardTemplate = document.querySelector("[data-user-template]")
    const userCardContainer = document.querySelector("[data-user-cards-container]")
    const searchBtn = document.querySelector("#search-btn");
    const createBtn = document.querySelector("#create-btn");
    const concertNameField = document.querySelector(".error-msg")
    const concertClicked = document.querySelector(".concert");

    searchBtn.addEventListener("click", (e) => {
  
      e.preventDefault();
      userCardContainer.innerHTML = '';
      concertNameField.classList.add("hidden");
      const concertName = document.querySelector("#concert-name").value;
      const url_ = buildURI(concertName);
     
      if(concertName !== '' && concertName !==null){
        getConcert(url_);
      }else{
        concertNameField.classList.remove("hidden");
      }
      
    })
<<<<<<< HEAD
    
    const buildURI = (concertName) => {
=======

>>>>>>> creatingPage

    const buildURI = (concertName) => {
      const artistName = document.querySelector("#artist-name").value;
      const cityName = document.querySelector("#city-name").value;
      let url_ = `api/v1/concert/?name=${concertName}`
      
      if (artistName !== "" && artistName !== null) {
        url_ += `&artistName="${artistName}"`
      }
      if (cityName !== "" && cityName !== null) {
        url_ += `&city="${cityName}"`
      }
      console.log(url_)
    
      return url_;
    }

    async function getConcert(url_) {
      console.log(url_)
      fetch(url_)
        .then(response => response.json())
        .then(data => {
          if(data.length === 0){
            userCardContainer.innerHTML = 'No Concert Found!';
          }else{
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
          }
        })
    }

