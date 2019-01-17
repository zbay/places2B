const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public/dist')));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' === req.method) {
    return res.sendStatus(200);
  }
  next();
});

const api = require('./api/api.js');
api(app);

app.listen(7654, () => {
    console.log("listening on port 7654");
});
