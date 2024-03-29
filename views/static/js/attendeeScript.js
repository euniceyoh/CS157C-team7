// if session is set & current url is not already set, set the url here 
/**
 * 1. get current url of the page (.../attendee)
 * 1.5: attendee.ejs should pass info to attendeeScript.js (this is new part)
 * 2. if the session profile is not set --> do nothing (should just return error page)
 * 3. else, get the session user information (specifically name)
 * 4.  set a 'userName' variable, so page can make queries to the specific username 
 * 5. done 
 */

let userName = loggedInUserName // accessing a global variable (TODO: is this an okay practice?)
let email = userName + "@gmail.com" // TODO: fix this 
console.log(email)

let bioButton = document.querySelector('#bioBtn')
let pConcertBtn = document.querySelector('#pConcertBtn')
let upConcertBtn = document.querySelector('#upConcertBtn')
let friendsBtn = document.querySelector('#friendsBtn')
let editBtn = document.querySelector('#editBtn')

getUserInfo()
clickedBio() 

bioButton.addEventListener("click", (e) => {
    e.preventDefault()
    clickedBio(); 
})

pConcertBtn.addEventListener("click", (e) => {
    e.preventDefault()
    clickedPastConcerts(); 
})

upConcertBtn.addEventListener("click", (e) => {
    e.preventDefault()
    clickedUpcomingConcerts(); 
})

friendsBtn.addEventListener("click", (e) => {
    e.preventDefault()
    clickedFriends(); 
})

editBtn.addEventListener("click", (e) => {
    e.preventDefault()
    clickedEdit(); 
})

function getUserInfo() {
  fetch(`/api/v1/person/getUser?email=${email}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    
    let image = document.querySelector("#userPP")
    let imageUrl = data['imgurl']
    image.setAttribute("src", imageUrl)

    let profile = document.querySelector('.profile_info')
    let profileName = profile.querySelector('h1')
    profileName.innerText = data['name']
  })
}

function resetActiveButton(currentButton) {
    let intraNav = document.querySelector(".nav_row")
    let navButtons = intraNav.querySelectorAll("button")
    
    for(let index = 0; index < navButtons.length; index++) {
      let btn = navButtons[index]
      if(btn.id != currentButton) {
        btn.classList.remove("activeBtn")
      }
    }

    let btn = document.querySelector("#" + currentButton)
    btn.classList.add("activeBtn")
}

function viewDetails(url, type) { // prob need to use event listener 
    if(type == 'concert')
      location.href=`/concert/${url}`
    if(type == 'person')
      location.href=`/attendee/${url}`
}

function clickedBio() {
    resetActiveButton("bioBtn")
    resetContent("summary")
    //content.innerHTML = '' // clear whatever was showing before 
    let mainContent = document.querySelector(".actual_content") 
    // clear
    mainContent.innerHTML = '';

    let bioTemplate = document.querySelector("#bio")
    let clone = bioTemplate.content.cloneNode(true)

    let summary = clone.querySelector("p")
    summary.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar aliquam ullamcorper. Quisque suscipit commodo neque, cursus porttitor dolor. Nam non tempor nulla. Pellentesque mattis, orci vitae molestie pellentesque, velit neque gravida massa, at mollis tortor ante vitae leo. Maecenas lacinia a ante id pharetra. Aliquam in rutrum ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    
    let favArtists = clone.querySelector("#f_artists") // a div 
    let favGenres = clone.querySelector("#f_genres") // a div 
    
    fetch(`/api/v1/person/getRelations?name=${userName}&rel=FAVORITES&outgoingNode=Artist`)
    .then(res => {
      console.log("line 106")
      return res.json() // returns a promise 
    })
    .then(data => {
      console.log(data)

      data.records.forEach(artist => {
        artist._fields.forEach(artistField => {
          console.log(artistField.properties.name)
          let artistDisplay = document.createElement("span")
          artistDisplay.innerText = artistField.properties.name
          artistDisplay.classList.add("single")
          favArtists.appendChild(artistDisplay)
        })
      })
    })

    fetch(`/api/v1/person/getRelations?name=${userName}&rel=FAVORITES&outgoingNode=Genre`)
    .then(res => res.json())
    .then(data => {
      data.records.forEach(genre => {
        genre._fields.forEach(genreField => {
          console.log(genreField.properties.name)
          let genreDisplay = document.createElement("span")
          genreDisplay.innerText = genreField.properties.name
          genreDisplay.classList.add("single")
          favGenres.appendChild(genreDisplay)
        })
      })
      // mainContent.appendChild(clone)
    })

    mainContent.appendChild(clone)

  }

  function resetContent(title) {
    let mainContent = document.querySelector(".content") 
    
    let child = document.querySelector("h2")
    child.innerText = title

    let actualContent = document.querySelector(".actual_content")
    actualContent.classList.remove("displayCards")
    actualContent.innerHTML = '' 
  }

  function clickedPastConcerts() {
    // remove "activeBtn" for everythng else 
    resetActiveButton("pConcertBtn")
    resetContent("past concerts")

    // call query to get a user's past concerts 
    let mainContent = document.querySelector(".actual_content") 
    mainContent.classList.add("displayCards")
    let card = document.querySelector("#upcoming_concerts")

    fetch(`/api/v1/person/getRelations?name=${userName}&rel=HAS_ATTENDED&outgoingNode=Concert`)
    .then(res => res.json())
    .then(data => {
      data.records.forEach(concert => {
        concert._fields.forEach(concertField => {
          console.log(concertField.properties)

          const child = card.content.cloneNode(true)
          const text = child.querySelector("h4")
          text.innerText = concertField.properties.name
          const url = child.querySelector("img")
          url.setAttribute('src', concertField.properties.imgurl)
          const button = child.querySelector("button") // fix button on click 
          button.innerText = "view details"

          let concertName = concertField.properties.name
          button.setAttribute("onclick", `viewDetails('${concertName}', 'concert')`)
          
          mainContent.appendChild(child)

        })
      })
    })
  }

  function clickedUpcomingConcerts() {
    resetActiveButton("upConcertBtn")
    resetContent("upcoming concerts")

    let mainContent = document.querySelector(".actual_content") 
    mainContent.classList.add("displayCards")
    let card = document.querySelector("#upcoming_concerts")

    fetch(`/api/v1/person/getRelations?name=${userName}&rel=WILL_ATTEND&outgoingNode=Concert`)
    .then(res => res.json())
    .then(data => {
      data.records.forEach(concert => {
        concert._fields.forEach(concertField => {
          console.log(concertField.properties)

          const child = card.content.cloneNode(true)
          const text = child.querySelector("h4")
          text.innerText = concertField.properties.name
          const url = child.querySelector("img")
          url.setAttribute('src', concertField.properties.imgurl)
          const button = child.querySelector("button") // fix button on click 
          button.innerText = "view details"

          let concertName = concertField.properties.name
          button.setAttribute("onclick", `viewDetails('${concertName}', 'concert')`)
          
          mainContent.appendChild(child)

        })
      })
    })
  }

  function clickedFriends() {
    resetActiveButton("friendsBtn")
    resetContent("friends")

    let mainContent = document.querySelector(".actual_content") 
    mainContent.classList.add("displayCards")
    let card = document.querySelector("#friends")

    fetch(`/api/v1/person/getRelations?name=${userName}&rel=IS_FRIENDS&outgoingNode=Person`)
    .then(res => res.json())
    .then(data => {
      data.records.forEach(person => {
        person._fields.forEach(personField => {
          console.log(personField.properties)

          const child = card.content.cloneNode(true)
          const text = child.querySelector("h4")
          text.innerText = personField.properties.name
          const url = child.querySelector("img")
          url.setAttribute('src', personField.properties.imgurl)
          const button = child.querySelector("button") 
          button.innerText = "view details"

          mainContent.appendChild(child)

        })
      })
    })
  }

function clickedEdit() {
    resetActiveButton("editBtn")
    resetContent("edit")    
}
