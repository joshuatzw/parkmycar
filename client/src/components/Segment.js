import { useEffect, useState } from 'react';


const axios = require('axios');
const d = new Date();
const year = d.getFullYear();

let month = d.getMonth() + 1;
if (month < 10) {
  month = String(month);
  month = "0"+ month
}

let day = d.getDate();
if (day < 10) {
  day = String(day);
  day = "0" + day
}

const hour = d.getHours();
let minute = d.getMinutes() - 1;
if (minute < 10){
  minute = String(minute)
  minute = "0" + minute
}

const second = d.getSeconds();


export default function Segment(props) {
  const [query, setQuery] = useState();
  const [lots, setLots] = useState();
  const [totalLots, setTotalLots] = useState();


  function btnHandler() {
    searchAPI(query)
  }

  async function searchAPI(location) {
    let carparkObject = {};
    axios.get(`https://api.data.gov.sg/v1/transport/carpark-availability?date_time=${year}-${month}-${day}T${hour}%3A${minute}%3A${second}`)
    .then((response)=>{
      let array = []
      array.push(response.data.items[0].carpark_data)
      // List holds the full array of carparks.
      let list = array[0]
      // This for loop assigns an index to each carpark number as an object.
      for (let i =0; i< list.length; i++){
        carparkObject[list[i].carpark_number] = i  
      }

      // HANDLE SEARCH:
      // use "query" as a key to find index
      // with index, retrieve further information:
      // console.log(carparkObject[location])
      let index = carparkObject[location]
      setTotalLots(list[index].carpark_info[0].total_lots)
      setLots(list[index].carpark_info[0].lots_available)
      console.log(list[index].carpark_info[0])

    })
  }

  return(
    <div>
      <h2> Carpark Number: </h2>
      <input placeholder="e.g. HE12" onChange={(e)=>{setQuery(e.target.value.toUpperCase())}}></input>
      <button onClick={btnHandler}> Search </button>

      <div>
        <h3> Total Lots: {totalLots} </h3>
        <h2> Lots Available: {lots} </h2>
      </div>
    </div>
  )
}