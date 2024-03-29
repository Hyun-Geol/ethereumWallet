let express = require('express');
let router = express.Router();
let db = require('../config/db')
let bcrypt = require('bcrypt-nodejs');
let CryptoJS = require('crypto-js');
let Web3 = require('web3');
let server = require('../config/web3server');

router.get('/', function (req, res, next) {
  if (req.session.is_logined === true) {
    return res.redirect('/main')
  }
  return res.render('signUpForPrivateKey', { title: '개인키로 회원가입' });
});

router.post('/', function (req, res, next) {
  let { userid, password1, password2, privatekey } = req.body;
  let idCheck = /^[A-za-z0-9]{5,15}/g;
  let passwordCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/;
  if (!idCheck.test(userid)) {
    return res.status(201).json({ message: "아이디는 영문자, 숫자로 시작하는 5~15자이어야합니다." })
  }
  if (password1.length < 8 || password1.length > 16 || !passwordCheck.test(password1)) {
    return res.status(201).json({ message: '암호를 8자이상 16자 이하의 특수문자 조합으로 설정해주세요.' })
  } else if (password1 !== password2) {
    return res.status(201).json({ message: "비밀번호가 일치하지 않습니다." })
  } else if (privatekey.length !== 66) {
    return res.status(201).json({ message: "올바른 개인키를 입력해주세요." })
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));
    if (req.session.web3) {
      web3 = new Web3(new Web3.prviders.HttpProvieder(req.session.web3))
    }
    let accounts = web3.eth.accounts.privateKeyToAccount(privatekey)
    let addrtf = web3.utils.isAddress(accounts.address)
    if (addrtf === false) {
      return res.status(201).json({ message: "올바른 개인키를 입력해주세요." })
    } else {
      let password = bcrypt.hashSync(password1)
      let private_key = CryptoJS.AES.encrypt(privatekey, password1)
      let sql = { userid, password, public_key: accounts.address, private_key }
      db.mysql.query('INSERT INTO wallet_info set ? ', sql, function (err, result) {
        if (err) {
          return res.status(202).json({})
        } else {
          return res.status(200).json({})
        }
      })
    }
  }

})

module.exports = router;
