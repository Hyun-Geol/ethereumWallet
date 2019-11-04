let express = require('express');
let router = express.Router();
let db = require('../config/db')
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session)
let Web3 = require('web3');
let server = require('../config/web3server');
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
    let { userid, public_key } = req.session;
    db.mysql.query(`SELECT * FROM txHash WHERE userid=?`, [userid], async function (err, txInfo) {
      if (err) {
        console.log("에러다", err)
      }
      await web3.eth.getBalance(public_key.toString(), function (err, wei) {
        balance = web3.utils.fromWei(wei, 'ether')
      })
      if (!txInfo.length) {
        TxHashList = '';
      } else if (txInfo.length > 0) {
        TxHashList = '<table class="table table-hover">';
        for (let i = 1; i <= txInfo.length; i++) {
          //http://203.236.220.40:3000/tx/ 개인 서버 열었을때(프로젝트 진행한 검색엔진으로)
          TxHashList += `
                    <tr>
                        <td><a href = https://ropsten.etherscan.io/tx/${txInfo[txInfo.length - i].txHash} target="_blank">${txInfo[txInfo.length - i].txHash}</a></td>
                    </tr>`
        }
        TxHashList += '</table>'
      }
      return res.render('main', { title: 'EthereumWallet', userid, public_key, balance, TxHashList });
    });
  }
});

router.post('/', function (req, res, next) {
  return res.json({})
})


module.exports = router;
