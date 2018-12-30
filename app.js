require('dotenv').config();
require('./app_api/models/db');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const uglifyJS = require('uglify-js');
const fs = require('fs');

const routes = require('./app_server/routes/index');
const apiRoutes = require('./app_api/routes/index');
// const users = require('./app_server/routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// Configuring UglifyJS to combine and minify Angular Application JS files
const appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/common/services/geolocation.service.js',
  'app_client/common/services/loc8rData.service.js',
  'app_client/common/filters/formatDistance.filter.js',
  'app_client/common/directives/ratingStars/ratingStars.directive.js'
];
const uglified = uglifyJS.minify(appClientFiles, { compress: false });

fs.writeFile('public/angular/loc8r.min.js', uglified.code, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Script generated and saved: loc8r.min.js')
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use('/', routes);
app.use('/api', apiRoutes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
