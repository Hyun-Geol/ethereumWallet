let express = require('express');
let router = express.Router();
let Web3 = require('web3');
let db = require('../config/db');
let server = require('../config/web3server');
let web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));

router.use(express.urlencoded({ extended: false }));

router.get('/', function (req, res, next) {
  return res.render('signUp', { title: '회원가입' });
});

router.post('/process', function (req, res, next) {
  let { userid, password } = req.body
  console.log(req.body)
  let newAccount = web3.eth.accounts.create()
  let sql = { userid, password, public_key: newAccount.address, private_key: newAccount.privateKey }
  console.log(newAccount)

  db.query(`INSERT INTO wallet_info set ? `, sql, function (err, result) {
    if (err) {
      console.log("개빡치네")
      return res.status(200).json({})
    } else {
      console.log("개빡치네2")
      return res.status(201).json({})
    }

  })

})


module.exports = router;
