let express = require('express');
let router = express.Router();
let Web3 = require('web3');
let db = require('../config/db');
let server = require('../config/web3server');
let web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));

router.get('/', function (req, res, next) {
  return res.render('signUp', { title: '회원가입' });
});

router.post('/', function (req, res, next) {
  let { id, password } = req.body
  let newAccount = web3.eth.accounts.create()
  let sql = { userid: id, password: password, public_key: newAccount.address, private_key: newAccount.privateKey}
  console.log(newAccount)
  console.log(id, password)

  db.query('INSERT INTO wallet_info set ?', sql , function (err, result) {
      if (err) {
        return res.status(200).json({})
      }
      return res.status(201).json({})
    })

})


module.exports = router;
