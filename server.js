const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/dist')));

const api = require('./server/api.js');
api(app);

app.listen(7654, function(){
    console.log("listening on port 7654");
});