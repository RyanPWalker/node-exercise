var exports = (module.exports = {});
const axios = require("axios");

exports.wrap = fn => (req, res, next) =>
  fn(req, res, next)
    .then(() => {})
    .catch(next);

exports.get = async function(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}`;
  const { data } = await axios.get(url);

  res.locals = await handleApiResponse(data, req.query);

  next();
};

exports.search = async function(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}/?search=${
    req.params.attribute
  }`;
  const { data } = await axios.get(url);

  res.locals = await handleApiResponse(data, req.query);

  next();
};

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
