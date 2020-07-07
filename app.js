const express = require("express");
const app = express();
const fs = require('fs')
const fetch = require('node-fetch');

app.set("views", __dirname + "/public");
app.use(express.static('assets'))
app.set("view engine", "ejs");

let appWeather;
app.get("/", (req, res) => {
    res.render("index", {appWeather});
});

app.get("/apps", (req, res) => {
    res.render("apps");
});

app.get('/apps/:app', function (req, res, next) {
  try {
    if (fs.existsSync(__dirname + "/public/apps/" + req.params.app + ".ejs")) {
      res.render("apps/" + req.params.app);
    }
    else {
      next();
    }
  } catch(err) {
    console.error(err)
  }
});




  // 404
app.use(function(req, res, next){
  res.status(404);
  
  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  
  // default to plain-text. send()
  res.type('txt').send('Not found');
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


// Get weather data and store it in a temp txt file
function loadDoc() {
    console.log("Updating...");
    // on localhost  https://cors-anywhere.herokuapp.com/
    fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?altitude=32&lat=62.973894682679&lon=8.7263370685753', {headers: {'origin': 'https://kurokodairu.tk'}})
    .then(res => res.json())
    .then(data => appWeather = JSON.stringify(data));
}

module.exports = app;
loadDoc();

function tick() {
  //get the mins of the current time
  var mins = new Date().getMinutes();
  if (mins == "00") {
    loadDoc();
  }
  //console.log('Minute ' + mins);
}

setInterval(tick, 60000);