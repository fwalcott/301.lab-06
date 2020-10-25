'use strict';

// Load Environment Variables from the .env file 

require('dotenv').config();

// Application Dependencies 

const express = require('express');
const cors = require('cors');
const superagent = require('superagent'); 
const { response, request } = require('express');
const pg = reqiure('pg') 

// Application Setup 

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors()); 
const cilent = new pg.Client(process.env.DATABase_URL);

//API Routes

app.get('/location', handleLocation);
app.get('/weather', handleWeather);  
app.get('/trails', handleTrails)

app.use('*', notFoundHandler)

//Location Handler 

function handleLocation(request, response) {
  let city = request.query.city; 
  let key = process.env.GEOCODE_API_KEY; 

const checkSQL = `SELECT * FROM loaction`; 
clientInformation.query(checkSQL) 
.then(data => 
  let dataCheck = data.rows.filter(value => valuse.search_query === city);
  if (dataCheck[0]){
response.status(200).send(dataCheck[0}); 
   } else {
    const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`; 
    superagent.get(URL) 
    .then(data => {
      let location = new Location(data.body[0], city); 
      response.status(200).send(location);
      const SQL = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *'; 
      const values = [location.search_query, location.formatted_query, location.latitude, location.longitude]; 
      clientInformation.query(SQL, values) 
      .then(data => {
        store data
      });
   });
  }
})
.catch( error => error500(request, response, error ));  
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
  .catch( error => error500(request, response, error ));  
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
  .catch( error => error500(request, response, error ));  
}

//Movies Handler 

function handleMovies(request, response){
  const para = {
    api_key: process.env.MOVIE_API_KEY, 
    query: request.query.search_query,
  };  
  const URL = 'https://api.themoviedb.org/3/search/movie';  

  superagent.get(URL)
  .query(para)
  .then(value => {
    let movies = value.body.results.map(newMovie => {
      return new movies(newMovie);
    }); 
    response.status(200).send(movies);
  })
  .catch( error => error500 (request, response, error));
}

//Yelp Handler

function handleYelp (request, response) {
  const itemsPerPage = 5; 
  const page = request.query.page || 1; 
  const start = ((page - 1) * itemsPerPage + 1);

  const para = {
    latitude: request.query.latitude,
    longitude: request.query.longitude 
    limit: itemsPerPage, 
    offset: start
  }; 
  const URL = 'https://api.yelp.com/v3/businesses/search';

  superagent.get(URL) 
  .auth(process.env.YELP_API_KEY, {type: 'bearer'})
  .query(para)
  .then(value => {
    let yelp = value.body.business.map(newYelp => {
      return new yelp(newYelp);
    });
    response.status(200).send(yelp)
  })
  .catch(error => error500(request, response, error));
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

//Movie Constructor

function Movies(obj){ 
//Not sure where to get the image pathe for the URL
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average 
  this.total_votes = obj.vote_count
  this.image_url = `${imgPath}${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.realease_on = obj.realease_date;
}

//Yelp Constuctor   
function YELP (obj) {
  this.name = obj.name;
  this.image_url =obj.image_url; 
  this.price = obj.price; 
  this.rating = obj.rating; 
  this.url = obj.url;
}

// Connect Datatbase to Server

client.connect() 
  .then(()=> {
    app.listen(PORT, () => {
      console.log(`It's Alive!`);
  });
})
.catch(error => {
  console.log('error message', error);
}); 

//Error Messages 

function notFoundHandler(request, response, error) {
  res.status(500).send(`Sorry! Didn't work!`);
  res.status(404).send(`Sorry! It is not here!`)
}


