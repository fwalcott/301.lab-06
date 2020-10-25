DROP TABLE IF EXIST trails; 

CREATE TABLE trails(

id SERIAL PRIMARY KEY, 
name VARCHAR(255), 
locations VARCHAR(255), 
lenght FLOAT, 
stars FLoat, 
summary VARCHAR(255), 
trail_url VARCHAR(255),
conditions VARCHAR(255), 
conditions_date VARCHAR(255)
);

DROP TABLE IF EXIST weather; 

CREATE TABLE weather(

id SERIAL PRIMARY KEY, 
forcast VARCHAR(255), 
time VARCHAR(255)
); 

DROP TABLE IF EXIST location;

CREATE TABLE location(

id SERIAL PRIMARY KEY, 
search_query VARCHAR(255), 
formatted_query VARCHAR(255),
latitude FLOAT, 
longitude FLOAT,
); 


