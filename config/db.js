let mysql = require('mysql');

let db_info = {
    host: 'localhost',
    user: 'root',
    password: '111111',
    port: 3306,
    database: 'Wallet'
}
let db = mysql.createConnection(db_info);

db.connect();

module.exports = {
    db,
    db_info
}