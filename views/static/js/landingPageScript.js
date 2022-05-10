const searchBtn = document.querySelector("#search-btn");
const concertNameField = document.querySelector("#concert-name");
searchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const concertName = concertNameField.value;
 
    if(concertName !== '' && concertName !==null){
        
        let url_ = `api/v1/concert/?name=${concertName}`
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
          console.log(data.json())
      })
  }