const express = require('express');
const path = require('path');

const app = express();
const router = require('./routes');

const jsonParser = express.json();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonParser);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

module.exports = app;