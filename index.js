const express = require('express');
const request = require('request');
const cors    = require('cors');
const app     = express();

app.use(cors());

app.get('/get/:item',
  get,
  jsonResponse
);

app.get('/search/:item/:attribute',
  search,
  jsonResponse
);

function get(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}`;
  console.log(url)
  request(url, handleApiResponse(res, next));
}

function search(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}/?search=${req.params.attribute}`;
  request(url, handleApiResponse(res, next));
}

function handleApiResponse(res, next) {
  return (err, response, body) => {
    if (err || body[0] === '<') {
      res.locals = {
        success: false,
        error: err || 'Invalid request. Please check your state variable.'
      };
      console.log("Failed")
      return next();
    }
    const results = JSON.parse(body).results !== undefined ? JSON.parse(body).results : JSON.parse(body);
    res.locals = {
      success: true,
      results: results
    };
    console.log(results)
    return next();
  };
}

function jsonResponse(req, res, next) {
  return res.json(res.locals);
}

const server = app.listen(3001, () => {
  const host = server.address().address,
    port = server.address().port;

  console.log('API listening at http://%s:%s', host, port);
});
