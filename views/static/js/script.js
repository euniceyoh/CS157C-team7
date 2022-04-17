
    const userCardTemplate = document.querySelector("[data-user-template]")
    const userCardContainer = document.querySelector("[data-user-cards-container]")
    const button = document.querySelector("#search-btn");

    button.addEventListener("click", (e) => {
      userCardContainer.textContent = '';
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
          data.forEach(record => console.log(record["datetime"]['properties']['concert_date']))

          users = data.map(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0]
            const header = card.querySelector("[data-header]")
            header.textContent = user["datetime"]['properties']['name']

            userCardContainer.append(card)
            return { name: user["datetime"]['properties']['name'], element: card }
          })

        })
    }