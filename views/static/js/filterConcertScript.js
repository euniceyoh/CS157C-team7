

    const userCardTemplate = document.querySelector("[data-user-template]")
    const userCardContainer = document.querySelector("[data-user-cards-container]")
    const button = document.querySelector("#search-btn");
    const concertClicked = document.querySelector(".concert");

    button.addEventListener("click", (e) => {
      // userCardContainer.textContent = '';
      e.preventDefault();
      getConcert("api/v1/concert/");
    })

    async function getConcert(url) {
      const concertName = document.querySelector("#concert-name").value;
      const artistName = document.querySelector("#artist-name").value;
      const cityName = document.querySelector("#city-name").value;
      let url_ = url + `?name=${concertName}`
      
      if (artistName !== "" && artistName !== null) {
        url_ += `&artistName=${artistName}`
      }
      if (cityName !== "" && cityName !== null) {
        url_ += `&city=${cityName}`
      }
      console.log(url_)

      fetch(url_)
        .then(response => response.json())
        .then(data => {
          data.forEach(record => {
            console.log(record["datetime"]['properties']['concert_date'])

            // "passing data to concert page"
            console.log(JSON.stringify(record))
            const recordName = record["datetime"]['properties']['name']
            console.log(recordName)
            const recordJson = JSON.stringify(record)
            localStorage.setItem(recordName, recordJson) 
          }
        )

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
