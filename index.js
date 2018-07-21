const express = require("express");
const cors = require("cors");
const app = express();
const control = require("./control.js");

app.use(cors());

app.get("/get/:item", control.wrap(control.get), jsonResponse);

app.get("/search/:item/:attribute", control.wrap(control.search), jsonResponse);

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
