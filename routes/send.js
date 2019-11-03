let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
  return res.render('send', { title: '전송' });
});

module.exports = router;
