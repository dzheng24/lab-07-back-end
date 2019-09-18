'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(cors());

app.get('/location', (request, response) =>{
  let searchQuery = request.query.data;
  const geoData = require('./data/geo.json');

  const location = new Location(searchQuery, geoData);

  response.status(200).send(location);
})

app.get('/weather', (request, response) => {
  const darkskyData = require('./data/darksky.json');  
  const weatherForecast = darkskyData.daily.data.map(obj => {
    return new Weather(obj);
  })

  response.status(200).send(weatherForecast);
})

function Location(searchQuery, geoData){
  this.search_query = searchQuery;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Weather(obj){
  this.forecast = obj.summary;
  this.time = this.formattedDate(obj.time);
}

Weather.prototype.formattedDate = function(time) {
  let date = new Date(time*1000);
  return date.toDateString();
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
