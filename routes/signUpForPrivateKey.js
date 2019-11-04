let express = require('express');
let router = express.Router();
let db = require('../config/db')
let bcrypt = require('bcrypt-nodejs');
let CryptoJS = require('crypto-js');
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
  return res.render('signUpForPrivateKey', { title: '개인키로 회원가입' });
});

router.post('/', function (req, res, next) {
  let { userid, password1, password2, privatekey } = req.body;
  let accounts = web3.eth.accounts.privateKeyToAccount(privatekey)
  let addrtf = web3.utils.checkAddressChecksum(accounts.address)
  if (addrtf === false || privatekey.length !== 66) {
    return res.status(203).json({})
  }
  let password = bcrypt.hashSync(password1)
  let private_key = CryptoJS.AES.encrypt(privatekey, password)
  let sql = { userid, password, public_key: accounts.address, private_key }

  if (password1 !== password2) {
    return res.status(202).json({})
  } else {
    db.mysql.query('INSERT INTO wallet_info set ? ', sql, function (err, result) {
      if (err) {
        return res.status(201).json({})
      } else {
        return res.status(200).json({})
      }
    })
  }

})

module.exports = router;
