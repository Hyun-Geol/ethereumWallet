let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
  return res.render('error', { title: 'error' });
});

module.exports = router;
