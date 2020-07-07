"use strict";
$(document).ready(function() { 
const weatherBoxes = document.querySelectorAll('.weatherBox');
const date = new Date();

let times = {};

function loadDoc() {
        let res = JSON.parse($('.data').attr('data'));;

        let j = 0;
        for(let i = 1; i < res.properties.timeseries.length; i++) {
          const prefix = res.properties.timeseries[i];

          if(res.properties.timeseries[i].time.includes("12:00:00Z")){
            times[j] = [formatTime(prefix.time), prefix.data.instant.details.air_temperature, prefix.data.next_6_hours.summary.symbol_code];
            j++;
          }
        }
        updateWeather();
}


// this is just fucking stupid
function formatTime(time) {
    time = time.slice(5,10)
    time = time.split("-");
    time.reverse();
    time = time.join("/");
    return time;
}


function updateWeather() {
  weatherBoxes.forEach((element, index) => {
    $(element).children("p.temp").text(times[index][1] + "°");
    $(element).children("p.summary").text("Expect: "+ times[index][2]);
    $(element).children("p.timestamp").text(times[index][0] + ` ${date.getFullYear()}`);
  });
  }

loadDoc(); 

});