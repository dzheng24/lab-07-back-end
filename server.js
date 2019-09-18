'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const superagent = require('superagent');

app.use(cors());

app.get('/location', (request, response) =>{
  let searchQuery = request.query.data;
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`

  superagent.get(URL)
    .then(superagentResults => {
        let locationData = superagentResults.body.results[0]
        console.log(superagentResults.body.results[0].geometry);
        const location = new Location(searchQuery, locationData);

        console.log(location);
        response.status(200).send(location);
    })
    .catch(superagentResults => {
      console.log('nothing');
  })

})

app.get('/weather', (request, response) => {
  try{
    const darkskyData = require('./data/darksky.json');

    const weatherForecast = darkskyData.daily.data.map(obj => {
      return new Weather(obj);
    })

    response.status(200).send(weatherForecast);
  }
  catch(error){
    handleError(error, response);
  }
})

function Location(searchQuery, locationData){
  this.search_query = searchQuery;
  this.formatted_query = locationData.formatted_address;
  this.latitude = locationData.geometry.location.lat;
  this.longitude = locationData.geometry.location.lng;
}

function Weather(obj){
  this.forecast = obj.summary;
  this.time = this.formattedDate(obj.time);
}

Weather.prototype.formattedDate = function(time) {
  let date = new Date(time*1000);
  return date.toDateString();
}

function handleError(error, response){
  console.error(error);
  const errorObj = {
    status: 500,
    text: 'Sorry, something went wrong'
  }
  response.status(500).send(errorObj);
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));

//{
//   "search_query": "seattle",
//   "formatted_query": "Seattle, WA, USA",
//   "latitude": "47.606210",
//   "longitude": "-122.332071"
// }



