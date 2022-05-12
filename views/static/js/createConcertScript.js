
const concertNameField = document.querySelector("#concert-name");
const artistNameField = document.querySelector("#artist-name");
const dateField = document.querySelector("#date");
const files = document.querySelector("#image-url");
const creatBtn = document.querySelector("#create-btn");

creatBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const datetimeValue = new Date(dateField.value);
    const year_ = datetimeValue.getFullYear();
    const month_ = datetimeValue.getMonth();
    const day_ = datetimeValue.getDate();
    const hour_ = datetimeValue.getHours();
    const minute_ = datetimeValue.getMinutes();

    const submitObj = {
        name: concertNameField.value,
        year:year_,
        month:month_,
        day:day_,
        hour:hour_,
        minute:minute_,
        second: 0,
        concertImage: files.value
    }
    console.log(submitObj);

    fetch("api/v1/concert",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitObj)
    })
    .then(response=>console.log(response))
    .then(() =>console.log("DONE")).catch((error) => {
        console.error('Error:', error);
      });
  
})