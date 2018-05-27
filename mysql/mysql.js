const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'user',
  user: 'root',
  password: '521zhuzhu**'
});
pool.getConnection(function (err, connection) {
  if (err) {
    console.log(err);
  } else {
    const add = function (data, cb) {
      const addSql = 'insert into userInfo(id, password, email) value(?, ?, ?)';
      const addData = [data.id, data.pw, data.email];
      connection.query(addSql, addData, function (err, rows) {
        connection.release();   //释放连接
        if (err) {
          cb(true, err);     
        } else {
          cb(false, rows);
        }
      })
    }
    const find  = function (data, cb) {
      const findSql = 'select * from userInfo where id=?';
      const findData = [data];
      connection.query(findSql ,findData, function (err, res) {
        connection.release();   //释放连接
        if (err) {
          cb(true, err);
        } else {
          cb(false, res);
        }
      })
    }
    exports.addSql  = add;
    exports.findSql = find;
  }
})