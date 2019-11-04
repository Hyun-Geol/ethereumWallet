let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt-nodejs');
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
  if (req.session.is_logined === true) {
    res.redirect('/main')
  }
  return res.render('index', { title: '로그인' });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();  // 세션 삭제
  res.clearCookie('sid'); // 세션 쿠키 삭제
  res.redirect('/');
})

router.post('/', function (req, res, next) {
  let { userid, password } = req.body;
  db.mysql.query('SELECT * FROM wallet_info WHERE userid =? ', [userid], function (err, data) {
    if (err) {
      return res.status(201).json({})
    }
    if (!data.length) {
      return res.status(202).json({})
    }
    bcrypt.compare(password, data[0].password, function (err, tf) {
      if (tf === true) {
        req.session.is_logined = true;
        req.session.userid = data[0].userid;
        req.session.password = data[0].password;
        req.session.public_key = data[0].public_key;
        req.session.private_key = data[0].private_key;
        req.session.save(function () {
          return res.status(200).json({})
        })
      } else {
        return res.status(201).json({})
      }
    })
  })
})



module.exports = router;
