var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');



var indexRouter = require('./routes/index');
var eventRouter = require('./routes/event');
var APIrouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(process.cwd() + '/uploads'))
var cors = require('cors');
app.use(cors());


app.use('/', indexRouter);
app.use('/event', eventRouter);
app.use('/api', APIrouter);
var db = mongoose.connection;
mongoose.connect('mongodb+srv://admin:kHsIKrhbYGoGFXS7@cluster0-zzaup.mongodb.net/diploma?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {  
  console.log('connected to db');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
