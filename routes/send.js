let express = require('express');
let router = express.Router();
let db = require('../config/db')
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)
let Web3 = require('web3');
let server = require('../config/web3server');
let CryptoJS = require('crypto-js');
let Tx = require('ethereumjs-tx').Transaction;
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
    res.redirect('/')
  } else {
    return res.render('send', { title: '전송' });
  }
});

router.post('/', async function (req, res) {
  let { toAddr, gasPrice, value } = req.body;
  let { public_key, userid, private_key, password } = req.session;

  if (toAddr.length !== 42) {
    return res.status(201).json({})
  }
  let ckAddr = web3.utils.checkAddressChecksum(toAddr);
  if (ckAddr === false) {
    return res.status(201).json({})
  }
  let gasLimit = 21000
  let gWei = 9
  let nonce = await web3.eth.getTransactionCount(public_key, "pending")
  let decrypted = CryptoJS.AES.decrypt(private_key, password)
  decrypted = decrypted.toString(CryptoJS.enc.Utf8).substring(2)
  let rawTx = {
    nonce: nonce,
    gasLimit: web3.utils.toHex(gasLimit),
    gasPrice: web3.utils.toHex(gasPrice * (10 ** gWei)),
    to: toAddr,
    value: web3.utils.toHex(web3.utils.toWei(value, 'ether'))
  }
  
  let tx = new Tx(rawTx, { chain: 'ropsten' });
  let privateKey = Buffer.from(decrypted, 'hex')
  tx.sign(privateKey)
  let serializedTx = tx.serialize();

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
    if (err) {
      return res.status(202).json({})
    }
    db.mysql.query('INSERT INTO txHash(userid, txHash) VALUES(?, ?)', [userid, hash], function (error, result) {
      if (error) {
        return res.status(201).json({})
      } else {
        return res.status(200).json({})
      }
    })
  })
})

module.exports = router;
