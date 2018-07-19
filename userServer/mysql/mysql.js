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
      const addSql = 'insert into userInfo(id, password, email, bookShelf, info, img, birth, fans, follow, sex) value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const addData = [data.id, data.pw, data.email, null, null, 'http://193.112.4.143/img/default.png', null, 0, 0, null];
      connection.query(addSql, addData, function (err, rows) {
        // connection.release();   //释放连接
        if (err) {
          cb(true, err);     
        } else {
          cb(false, rows);
        }
      })
    }

    const addCom = function (data, cb) {
      const addSql = 'insert into comments(bookId, id, text) value(?, ?, ?)';
      const addData = [data.bookId, data.id, data.text];
      connection.query(addSql, addData, function (err, rows) {
        // connection.release();   //释放连接
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
        // connection.release();   //释放连接
        if (err) {
          cb(true, err);
        } else {
          cb(false, res);
        }
      })
    }
    
    const findComAll  = function (cb) {
      const findSql = 'select * from comments';
      connection.query(findSql , function (err, res) {
        // connection.release();   //释放连接
        if (err) {
          cb(true, err);
        } else {
          cb(false, res);
        }
      })
    }

    const update = function (data, cb) {
      const updateSql = 'update userInfo set bookShelf=? where id=?'
      const updateData = [data.bookShelf, data.id];
      connection.query(updateSql, updateData, (err, res) => {
        if (err) {
          cb(true, err);
        } else {
          cb(false, res);
        }
      })
    }
    const updateData = function (data, cb) {
      const updateSql = 'update userInfo set img=?, info=?, sex=?, birth=? where id=?'
      const updateData = [data.img, data.intro, data.gender, data.birth, data.nickname];
      connection.query(updateSql, updateData, (err, res) => {
        if (err) {
          cb(true, err);
        } else {
          cb(false, res);
        }
      })
    }

    exports.updateSql = update;
    exports.updateData = updateData;
    exports.addSql  = add;
    exports.addComSql  = addCom;
    exports.findSql = find;
    exports.findComAll = findComAll;
  }
})