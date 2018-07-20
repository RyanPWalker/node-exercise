const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

const wrap = fn => (req, res, next) =>
  fn(req, res, next)
    .then(() => {})
    .catch(next);

app.use(cors());

app.get("/get/:item", wrap(get), jsonResponse);

app.get("/search/:item/:attribute", wrap(search), jsonResponse);

async function get(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}`;
  const { data } = await axios.get(url);

  res.locals = await handleApiResponse(data, req.query);

  next();
}

async function search(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}/?search=${
    req.params.attribute
  }`;
  const { data } = await axios.get(url);

  res.locals = await handleApiResponse(data, req.query);

  next();
}

async function handleApiResponse(data, query) {
  const results = data.results || data;

  // Sorting begin
  const item = query.sort;
  if (item !== undefined) {
    results.sort(function(a, b) {
      return a[item].localeCompare(b[item], "kn", { numeric: true });
    });
  }
  // Sorting end

  // Fetch residents
  const residents = results[0].residents;
  if (residents && query.residents) {
    await Promise.all(
      residents.map(async (resp, i) => {
        const { data } = await axios.get(resp);
        results[0].residents[i] = data.name;
      })
    );
  }

  return {
    success: true,
    results: results
  };
}

function jsonResponse(req, res, next) {
  return res.json(res.locals);
}

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Not Found"
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: "Server Error"
  });
  console.error(err);
});

const server = app.listen(3001, () => {
  const port = server.address().port;

  console.log("API listening at http://localhost:%s", port);
});
