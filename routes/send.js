let express = require('express');
let router = express.Router();
let db = require('../config/db')
let Web3 = require('web3');
let server = require('../config/web3server');
let bcrypt = require('bcrypt-nodejs');
let CryptoJS = require('crypto-js');
let Tx = require('ethereumjs-tx').Transaction;

router.get('/', function (req, res, next) {
  if (req.session.is_logined !== true) {
    return res.redirect('/')
  }
  return res.render('send', { title: '전송' });
});

router.post('/', async function (req, res) {
  let { password, toAddr, gasPrice, value, inputData } = req.body;
  let { public_key, userid, private_key } = req.session;
  web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));
  if(req.session.web3) {
    web3 = new Web3(new Web3.providers.HttpProvider(req.session.web3))
  }
  let ckAddr = await web3.utils.isAddress(toAddr);
  if (toAddr.length !== 42 || ckAddr === false) {
    return res.status(201).json({ message: "올바른 주소를 입력해주세요." })
  }
  let sessionPassword = req.session.password;
  bcrypt.compare(password, sessionPassword, async function (err, tf) {
    if (err || tf !== true) {
      return res.status(201).json({ message: "올바른 비밀번호를 입력해주세요." })
    }
    if (tf === true) {
      let gasLimit = 100000
      let gWei = 9
      let nonce = await web3.eth.getTransactionCount(public_key, "pending")

      let decrypted = CryptoJS.AES.decrypt(private_key, password)
      decrypted = decrypted.toString(CryptoJS.enc.Utf8).substring(2)

      let rawTx = {
        nonce: nonce,
        gasLimit: web3.utils.toHex(gasLimit),
        gasPrice: web3.utils.toHex(gasPrice * (10 ** gWei)),
        to: toAddr,
        value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
        data: web3.utils.toHex(inputData)
      }

      let tx = new Tx(rawTx, { chain: 'ropsten' });
      let privateKey = Buffer.from(decrypted, 'hex')
      tx.sign(privateKey)
      let serializedTx = tx.serialize();

      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (err) {
          return res.status(202).json({})
        }
        let sql = { userid: userid, network: req.session.network, txHash: hash }
        db.mysql.query('INSERT INTO txHash set ?', sql, function (error, result) {
          if (error) {
            return res.status(201).json({ message: "DB저장 실패" })
          }
        })
      })
      return res.status(200).json({})
    }
  })
})

module.exports = router;
