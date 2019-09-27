require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movie-data.js');

console.log(process.env.API_TOKEN);
const app = express();
app.use(morgan('dev'));

app.use(function validateBearerToken(req, res ,next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    console.log(`authorizing ${apiToken}`)
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unathorized request'})
    }
    next();
})

function displayMovies(req, res) {
    return res.json(movies)
}

function displaySelection(req,res) {
    const { genre, country, avg_vote } = req.query;
    let results = movies;


    if(!['genre' || 'country' || 'avg_vote']) {
        return res.status(400).send('Invalid Entry. Search options include genre, country or avg_vote only!')
        }
    
    if(genre) {
        console.log(genre)
        results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }

    if(country) {
        console.log(country);
        results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    
    if(avg_vote) {
        let num = Number(avg_vote)
        console.log( typeof num, num)
        results = results.filter(movie => movie.avg_vote >= num)
    }
    res.json(results);
}

app.get('/movies', displayMovies);
app.get('/movies_search', displaySelection);

app.listen(8000, () => {
    console.log(`Server listening at http://localhost:8000`)
  })