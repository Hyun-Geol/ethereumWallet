let createError = require('http-errors');
let express = require('express');
let app = express();
let logger = require('morgan');

let index = require('./routes/index');
let signUp = require('./routes/signUp');
let signUpForPrivateKey = require('./routes/signUpForPrivateKey');
let send = require('./routes/send');
let getPrivateKey = require('./routes/getPrivateKey');

app.use('/public', express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use('/', index);
app.use('/signUp', signUp);
app.use('/signUpForPrivateKey', signUpForPrivateKey);
app.use('/send', send);
app.use('/getPrivateKey', getPrivateKey);

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
  res.render('error', { title: 'error' });
});

module.exports = app;
