'use strict';

// Load Environment Variables from the .env file 

require('dotenv').config();

// Application Dependencies 

const express = require('express');
const cors = require('cors');
const superagent = require('superagent'); 
const { response, request } = require('express');

// Application Setup 

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//API Routes

app.get('/location', handleLocation);
app.get('/weather', handleWeather);  
app.get('/trails', handleTrails)

//app.use('*', notFoundHandler)

//Location Handler 

function handleLocation(request, response) {
  let city = request.query.city; 
  let key = process.env.GEOCODE_API_KEY; 

  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  superagent.get(URL) 
  .then(data => {
    let location = new Location(data.body[0], city); 
    response.status(200).send(location);
  }); 
} 

//Weather Handler

function handleWeather(request, response){
  let parameters = {
    key: process.env.WEATHER_API_KEY,
    lat: request.query.latitude, 
    lon: request.query.longitude, 
    days: 8 
  }; 

  const URL = `https://api.weatherbit.io/v2.0/forecast/daily`; 
  superagent.get(URL) 
  .query(parameters) 
  .then(value => {
    let forecast = value.body; 
    let weatherArr = forecast.data.map(daily => {
      return new Weather(daily); 
    }); 
    response.status(200).send(weatherArr);
  }) 
  .catch(error => {
    response.status(500).send('Something went wrong !!!!'); 
    console.log(error);
  });
}

//Trails Handler 

function handleTrails(request, response){
  let parameters = {
    key: process.env.TRAIL_API_KEY, 
    lat: request.query.latitude, 
    lon: request.query.longitude,
    maxResults: 10
  }; 

  const URL = `https://www.hikingproject.com/data/get-trails`; 
  superagent.get(URL) 
  .query(parameters) 
  .then(value => {
    let trails = value.body.trails.map(newTrail => {
      return new Trail(newTrail);
    }); 
    response.status(200).send(trails);
  })
    .catch(error => {
    response.status(500).send('Sorry, Something went wrong !'); 
    console.log(error);
    });
}

//Constructor Functions  

//Location Constructor 

function Location(obj, query) {
  this.search_query = query;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}   

//Weather Constructor 

function Weather(obj){
  this.forecast= obj.weather.description;
  this.time = new Date(obj.valid_date).toDateString();                     
} 

//Trails Constructor 

function Trail(obj){
  this.name = obj.name; 
  this.location = obj.location; 
  this.length = obj.lenght; 
  this.stars = obj.stars; 
  this.star_votes = obj.starVotes;
  this.summary = obj.summary; 
  this.trail_url = obj.url; 
  this.conditions = obj.conditionStatus; 
  this.condition_date = obj.conditionDate.split(' ')[0]; 
  this.condition_time = obj.conditionDate.split(' ')[1]; 
}



// Make sure the server is listening for requests

app.listen(PORT, () => {
  console.log(`It's Alive!`);
});
