let express = require('express');
let router = express.Router();
let db = require('../config/db')
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)
let Web3 = require('web3');
let server = require('../config/web3server');
let bcrypt = require('bcrypt-nodejs')
let CryptoJS = require('crypto-js')
let web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));

router.use(session({
  key: 'Wallet',
  secret: 'sid',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(db.info)
}))


router.get('/', function (req, res, next) {
  if (req.session.is_logined !== true) {
    return res.redirect('/')
  } 
  return res.render('getPrivateKey', { title: '프라이빗키 가져오기' });
});

router.post('/', function (req, res, netx) {
  let { password } = req.body;
  bcrypt.compare(password, req.session.password, function (err, tf) {
    if (tf === true) {
      let decrypt = CryptoJS.AES.decrypt(req.session.private_key, password)
      let privateKey = decrypt.toString(CryptoJS.enc.Utf8)
      return res.status(200).json({ privateKey: privateKey })
    } else {
      return res.status(201).json({})
    }
  })
})

module.exports = router;
