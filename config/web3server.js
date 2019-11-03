let Web3 = require('web3');
let mainnet = 'https://mainnet.infura.io/v3/25c7c08910c04b0c9be79c09f559652e'
let ropsten = 'https://ropsten.infura.io/v3/25c7c08910c04b0c9be79c09f559652e'
let kovan = 'https://kovan.infura.io/v3/25c7c08910c04b0c9be79c09f559652e'
let rinkeby = 'https://rinkeby.infura.io/v3/25c7c08910c04b0c9be79c09f559652e'
let goerli = 'https://goerli.infura.io/v3/25c7c08910c04b0c9be79c09f559652e'
let web3 = new Web3(new Web3.providers.HttpProvider(ropsten));

module.exports = {
    web3,
    mainnet,
    ropsten,
    kovan,
    rinkeby,
    goerli
}
