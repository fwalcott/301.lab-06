'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');


// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.send('Home Page!');
});

app.get('/bad', (request, response) => {
  throw new Error('poo');
});

// The callback can be a separate function. Really makes things readable
app.get('/about', aboutUsHandler);

function aboutUsHandler(request, response) {
  response.status(200).send('About Us Page');
}

// API Routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather); 

  
//Location Handler
function handleLocation(req, res) {
  try {
    const geoData = require('./server/data/location.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.send(locationData);
  }
  catch (error) {
    console.log('ERROR', error);
    response.status(500).send('So sorry, something went wrong.');
  }
}
//Weather Handler 
function handleWeather (req, res){
  try {
    const forecastArr = []; 
    let forcast = require('./data/weather.json'); 
    forecast.data.forEach(value => {
      forecastArr.push(new Weather(value));
    });  
    response.send(forecastArr);
  }
  catch(error){
      error500();
    }
  }


// app.get('/restaurants', handleRestaurants);

app.use('*', notFoundHandler);


//Constructor Functions  

//Location Function
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}   

//Weather Function
function Weather(obj){
  this.forecast= obj.weather.description;
  this.time = new Data(obj.valid_date).toDateString();                     
} 
  

/* 
function handleRestaurants(request, response) {
  try {
    const data = require('./server/data/restaurants.json');
    const restaurantData = [];
    data.nearby_restaurants.forEach(entry => {
      restaurantData.push(new Restaurant(entry));
    });
    response.send(restaurantData);
  }
  catch (error) {
    console.log('ERROR', error);
    response.status(500).send('So sorry, something went wrong.');
  }
} */


/* function Restaurant(entry) {
  this.restaurant = entry.restaurant.name;
  this.cuisines = entry.restaurant.cuisines;
  this.locality = entry.restaurant.location.locality; */
//} 


function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function error500(){
  return response.status(500).send('Sorry, something went wrong, ...')};

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
