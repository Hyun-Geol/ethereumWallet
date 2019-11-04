let mySql = require('mysql');

let info = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'wallet'
}
let mysql = mySql.createConnection(info);

mysql.connect(function (err) {
    if (err) {
        console.error('DB 연동 실패');
        console.error(err);
        throw err;
    } else {
        console.log("DB 연동 성공");
    }
})

module.exports = {
    mysql,
    info
}