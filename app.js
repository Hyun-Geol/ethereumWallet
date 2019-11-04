let createError = require('http-errors');
let express = require('express');
let app = express();
let logger = require('morgan');

let indexRouter = require('./routes/index');
let signUpRouter= require('./routes/signUp');
let signUpForPrivateKeyRouter = require('./routes/signUpForPrivateKey');
let mainRouter = require('./routes/main');
let sendRouter = require('./routes/send');
let getPrivateKeyRouter = require('./routes/getPrivateKey');
let errorRouter = require('./routes/error');

app.use('/public', express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/signUp', signUpRouter);
app.use('/signUpForPrivateKey', signUpForPrivateKeyRouter);
app.use('/main', mainRouter);
app.use('/send', sendRouter);
app.use('/getPrivateKey', getPrivateKeyRouter);
app.use('/error', errorRouter);

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
