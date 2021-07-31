var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var paperAdvRouter = require('./routes/paperAdvancements');

var app = express();

app.use(cors());
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/paperAdvancements', paperAdvRouter);

app.use(express.static(__dirname + '/public'));
app.use('/CinImg', express.static('CinImg'));

module.exports = app;
