let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
  return res.render('signUpForPrivateKey', { title: '개인키로 회원가입' });
});

module.exports = router;
