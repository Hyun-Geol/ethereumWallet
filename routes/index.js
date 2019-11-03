let express = require('express');
let router = express.Router();
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)
let web3 = require('../config/web3server')
let db = require('../config/db')

router.use(session({
  key: 'Wallet',
  secret: 'sid',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(db.db_info)
}))


router.get('/', function (req, res, next) {
  return res.render('index', { title: '로그인' });
});

module.exports = router;
