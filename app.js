'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = 8001;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/v1.2', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);

app.use(express.static('./src/client/'));
app.use(express.static('./'));
app.use(express.static('./tmp'));

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
  console.log('\n__dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd() + '\n');
});
