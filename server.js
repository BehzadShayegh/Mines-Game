//server.js
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));
app.use(favicon(__dirname + 'public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'build', 'public/index.html'));
});
app.listen(port);