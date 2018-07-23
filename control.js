var exports = (module.exports = {});
const axios = require("axios");

exports.wrap = fn => (req, res, next) =>
  fn(req, res, next)
    .then(() => {})
    .catch(next);

exports.get = async function(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}`;
  const { data } = await axios.get(url);

  res.locals = await handleApiResponse(data, req);

  next();
};

exports.search = async function(req, res, next) {
  const url = `https://swapi.co/api/${req.params.item}/?search=${
    req.params.attribute
  }`;
  const { data } = await axios.get(url);

  res.locals = await handleApiResponse(data, req);

  next();
};

async function handleApiResponse(data, req) {
  results = data.results || data;

  // Pagination begin
  let next = data.next;
  while (next !== null && next !== undefined) {
    data = await axios.get(next);
    let results2 = data.data.results || data.data;
    next = data.data.next || data.next;
    results = results.concat(results2);
  }
  // Pagination end

  // Sorting begin
  const item = req.query.sort; // e.g. sort=name
  if (item !== undefined) {
    results.sort(function(a, b) {
      return a[item].localeCompare(b[item], "kn", { numeric: true });
    });
  }
  // Sorting end

  // Fetch residents
  const residents = results[0].residents; // Just the first group of residents for now...
  if (residents && req.query.residents) {
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
