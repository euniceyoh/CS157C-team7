
const concertNameField = document.querySelector("#concert-name");
const artistNameField = document.querySelector("#artist-name");
const dateField = document.querySelector("#date");
const files = document.querySelector("#image-url");
const creatBtn = document.querySelector("#create-btn");
const spinner = document.querySelector("#spinner");

creatBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    spinner.classList.remove("hidden");
    const requestObj = requestObjParsing();
    console.log(requestObj);

    fetch("api/v1/concert",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestObj)
    })
    .then(response=>{
        console.log(response)
    })
    .then((data) =>{
        alert(`Concert ${concertNameField.value} added successfully!`);
        location.href=`http://localhost:3000/`
    })
    .catch((error) => {
        console.error('Error:', error);
      });
  
})

const requestObjParsing = () =>{
    const datetimeValue = new Date(dateField.value);
    const year_ = datetimeValue.getFullYear();
    const month_ = datetimeValue.getMonth()+1;
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
    return submitObj;

}