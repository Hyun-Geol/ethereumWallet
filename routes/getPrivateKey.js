let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
  return res.render('getPrivateKey', { title: '프라이빗키 가져오기' });
});

module.exports = router;
