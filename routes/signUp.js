let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt-nodejs');
let CryptoJS = require('crypto-js');
let db = require('../config/db')
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)
let Web3 = require('web3');
let server = require('../config/web3server');
let web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));

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
  return res.render('signUp', { title: '회원가입' });
});

router.post('/', function (req, res, next) {
  let { userid, password1, password2 } = req.body;
  let newAccount = web3.eth.accounts.create();
  let public_key = newAccount.address;

  let password = bcrypt.hashSync(password1)
  let private_key = CryptoJS.AES.encrypt(newAccount.privateKey, password).toString();

  let sql = { userid, password, public_key, private_key }

  if (password1 !== password2) {
    return res.status(202).json({})
  } else {
    db.mysql.query('INSERT INTO wallet_info set ? ', sql, function (err, result) {
      if (err) {
        console.log(err)
        return res.status(201).json({})
      } else {
        return res.status(200).json({})
      }
    })
  }
})


module.exports = router;
