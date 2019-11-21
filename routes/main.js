let express = require('express');
let router = express.Router();
let db = require('../config/db')
let Web3 = require('web3');
let server = require('../config/web3server');
let g_network = "Ropsten"

router.get('/', function (req, res, next) {
  if (req.session.is_logined !== true) {
    return res.redirect('/')
  } else {
    let web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));
    if(req.session.web3) {
      web3 = new Web3(new Web3.providers.HttpProvider(req.session.web3))
    }
    if(req.session.network){
      g_network = req.session.network
    }
    let { userid, public_key } = req.session;
    db.mysql.query(`SELECT * FROM txHash WHERE userid=?`, [userid], async function (err, txInfo) {
      if (err) {
      }
      await web3.eth.getBalance(public_key.toString(), function (err, wei) {
        balance = web3.utils.fromWei(wei, 'ether')
      })
      if (!txInfo.length) {
        TxHashList = '';
      } else if (txInfo.length > 0) {
        TxHashList = '';
        for (let i = 1; i <= txInfo.length; i++) {
          //http://203.236.220.40:3000/tx/ 개인 서버 열었을때(프로젝트 진행한 검색엔진으로)
          TxHashList += `
                    <tr>
                        <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;"><a href = http://175.125.21.32:3000/tx/${txInfo[txInfo.length - i].txHash} target="_blank">${txInfo[txInfo.length - i].txHash}</a></td>
                    </tr>`
        }
      }
      return res.render('main', { title: 'EthereumWallet', userid, public_key, balance, TxHashList, network: g_network });
    });
  }
});

router.post('/', function (req, res, next) {
  let { txHash } = req.body
  data = txHash.toString().substring(1, 67)
  return res.json({})
})

router.post('/changeNetwork', async function (req, res) {
  let network = req.body.network;
  g_network = network;

  if (network === 'MainNet') {
      web3 = new Web3(new Web3.providers.HttpProvider(server.mainnet));
      req.session.web3 = server.mainnet
      req.session.network = g_network;
      req.session.save(function () { })
      return res.json({});
  }

  else if (network === 'Kovan') {
      web3 = new Web3(new Web3.providers.HttpProvider(server.kovan));
      req.session.web3 = server.kovan
      req.session.network = g_network;
      req.session.save(function () { })
      return res.json({});
  }

  else if (network === 'Rinkeby') {
      web3 = new Web3(new Web3.providers.HttpProvider(server.rinkeby));
      req.session.web3 = server.rinkeby
      req.session.network = g_network;
      req.session.save(function () { })
      return res.json({});
  }

  else if (network === 'Goerli') {
      web3 = new Web3(new Web3.providers.HttpProvider(server.goerli));
      req.session.web3 = server.goerli
      req.session.network = g_network;
      req.session.save(function () { })
      return res.json({})
  }

  else if (network === 'Ropsten') {
      web3 = new Web3(new Web3.providers.HttpProvider(server.ropsten));
      req.session.web3 = server.ropsten
      req.session.network = g_network;
      req.session.save(function () { })
      return res.json({})
  }
})


module.exports = router;
