let express = require('express');
let router = express.Router();

let db = require('../config/db')
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)

router.use(session({
  key: 'Wallet',
  secret: 'sid',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(db.info)
}))

router.get('/', function (req, res, next) {
  return res.render('error', { title: 'error' });
});

module.exports = router;
