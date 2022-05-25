let concertName = document.currentScript.getAttribute('name');
let submitButton = document.querySelector('#submit')
let deleteButton = document.querySelector('#deleteBtn')

let date = ""
let gender = "" 
let concertLocation = ""

console.log(concertName)
displayAttendButton() 
getConcert()
getAttendees(); 

function displayAttendButton() {
    console.log("diplay attend")
    let concertInfo = document.querySelector("#concertInfo")
    let template = document.querySelector("#attendance")
    let child = template.content.cloneNode(true)
    let button = child.querySelector("button")

    // display correct status 
    let user = "Eunice"
    let concert = "After Hours Til Dawn Tour"

    fetch(`http://localhost:3000/api/v1/concert/willAttendExists?name=${user}&concert=${concert}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)

      if(data == true) {
        button.innerText = "Attending"
      } else {
        button.innerText = "Attend"
      }
      concertInfo.appendChild(child)

      let attendButton = document.querySelector("#attendButton")
      attendButton.addEventListener("click", (e) => {
        e.preventDefault();
        modifyAttend(); 
    })
    })
}

function modifyAttend() { // will this still show up 
    // let button = document.querySelector("#attendButton")
    let data = {user: "Eunice", concert: concertName} // update user to current logged in user !!
    console.log(data)

    if(attendButton.innerText == "Attend") {
      fetch(`http://localhost:3000/api/v1/concert/willAttend`, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then( res => res.json())
      .then(data => {
        console.log(data)
        attendButton.innerText = "Attending"
      })
    } else if(attendButton.innerText == "Attending") {
      alert("No longer attending")
      fetch(`http://localhost:3000/api/v1/concert/deleteAttend`, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then( res => res.json())
      .then(data => {
        console.log(data)
        attendButton.innerText = "Attend"
      })
    }
  }

  function getLocation() {
    return fetch(`http://localhost:3000/api/v1/concert/location?concert=${concertName}`)
    .then(res => res.json())
  }

  function getConcert() {
    // query concert data here here 
    fetch(`http://localhost:3000/api/v1/concert/filter/?name=${concertName}`)
    .then(res => res.json())
    .then(data => {
      
      //getLocation()

      let concertInfo = document.querySelector('#concertInfo')
      let imgContent = concertInfo.querySelector("img")
      let url = data[0]['datetime']['properties']['imgurl']
      //let venue = concertLocation 

      let date = data[0]['datetime']['properties']['concert_date']
      let month = date['month']['low']
      let day = date['day']['low']
      let year = date['year']['low']
      let fullDate = month + '/' + day + '/' + year

      imgContent.setAttribute('src', url)
      let otherContent = concertInfo.querySelectorAll("p")
      
      otherContent[0].innerText = fullDate; 

      getLocation()
      .then(data => {
        console.log(data)
        locationSplit = data[0]['_fields'][0]['properties']
        concertLocation = locationSplit['city'] + ", " + locationSplit["state"]
        console.log(concertLocation)
        otherContent[1].innerText = concertLocation; 
      })
    })
  }

  function getAttendees() {
    console.log("frontend: " + gender)
    console.log("frontend: " + date)
    fetch(`http://localhost:3000/api/v1/concert/attendees?name=${concertName}&date=${date}&gender=${gender}`)
    .then(res => res.json())
    .then(data => {
      console.log("concert attendees:" + JSON.stringify(data))

      let list = document.querySelector('.list_of_attendees')
      list.innerHTML = ''
      let card = document.querySelector('#card') // template 

      data.forEach((person) => {
        console.log("each person: " + JSON.stringify(person))

        const child = card.content.cloneNode(true)
        const text = child.querySelector("h4")
        text.innerText = person.name.properties.name
        console.log(person.name.properties)
        console.log(person.name.properties.name)

        const url = child.querySelector("img")
        url.setAttribute('src', person.name.properties.imgurl)
        const button = child.querySelector("button") 
        button.innerText = "view details"
        button.setAttribute("onclick", `viewDetails('${person.name.properties.name}', 'person')`)

        list.appendChild(child)
      })
    })
  }

function deleteConcert() {
  let data = {name: concertName}
  console.log(data)

  fetch(`http://localhost:3000/api/v1/concert/delete`, {
    method: 'POST', 
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then( res => res.json())
  .then(data => {
    console.log(data)
    alert("Concert Deleted")
    location.href=`http://localhost:3000/`
  })
}

submitButton.addEventListener("click", (e) => { // does "click" have any other additional meaning?"
    e.preventDefault()
    getFormData()
    getAttendees()
})

deleteButton.addEventListener("click", (e) => {
  e.preventDefault()
  deleteConcert()
})

function getFormData() {
    console.log("submitted form")
    gender = document.querySelector('#gender').value;
    date = document.querySelector('#age').value;
}

function viewDetails(url, type) {
    if(type == 'concert')
    location.href=`http://localhost:3000/concert/${url}`
    if(type == 'person')
    location.href=`http://localhost:3000/attendee/${url}`
}


    