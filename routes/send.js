let express = require('express');
let router = express.Router();
let db = require('../config/db')
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)
let Web3 = require('web3');
let server = require('../config/web3server');
let CryptoJS = require('crypto-js');
let Tx = require('ethereumjs-tx').Transaction
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
router.post('/', function (req, res, next) {
  const gasLimit = 21000
  const gWei = 9
  sendTransaction = async () => {
    let { toAddr, gasPrice, value } = req.body;
    var nonce = await web3.eth.getTransactionCount(req.session.public_key, "pending")
    let decrypted = CryptoJS.AES.decrypt(req.session.private_key, req.session.password)
    decrypted = decrypted.toString(CryptoJS.enc.Utf8).substring(2)
    if (toAddr.length !== 42) {
      return res.status(201).json({})
    } else {
      let ckAddr = web3.utils.checkAddressChecksum(toAddr)
      if (ckAddr === false) {
        return res.status(201).json({})
      }
    }
    if (ckAddr === true && toAddr.length === 42) {
      let privateKey = new Buffer.from(decrypted, 'hex')
      web3.eth.getBalance(req.session.public_key.toString(), function (err, wei) {
        balance = web3.utils.fromWei(wei, 'ether')
        // gas = web3.utils.fromWei(gasPrice, 'Gwei')
        // balance = parseFloat(balance)
        // sendBalance = parseFloat(value) + parseFloat(gas)

        //  if (balance < sendBalance) {
        if (err) {
          return res.status(201).json({})
        }
        //  } else if (balance > sendBalance) {
        const rawTx = {
          nonce: nonce,
          gasLimit: web3.utils.toHex(gasLimit),
          gasPrice: web3.utils.toHex(gasPrice * (10 ** gWei)),
          from: req.session.public_key,
          to: toAddr,
          value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
          data: ''
        }
        let tx = new Tx(rawTx, { chain: 'ropsten' });
        tx.sign(privateKey)
        let serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
          if (err) {
            return res.status(202).json({})
          } else {
            db.mysql.query('SELECT * FROM txhash where userid=?', [req.session.userid], function (err, userInfo) {
              if (err) throw err;
              if (userInfo.length) {
                txHash = new Array();
                txHash = hash;
                db.mysql.query('INSERT INTO txHash(userid, txHash) VALUES(?, ?)', [req.session.userid, txHash], function (error, result) {
                  if (error) {
                    console.log(error)
                  } else {
                    return res.status(200).json({})
                  }
                })
              }
            })
          }
        })
        // }
      })
    }
  }
  sendTransaction()
})

module.exports = router;
