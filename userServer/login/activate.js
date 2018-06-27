const express = require('express');
const mysql = require('../mysql/mysql');

const router = express.Router();
router.get('/', (req, res, next) => {
  if (req.session.activate) {
    const info = req.session.activate.split('|nvnv|');
    req.userInfo = {
      id: info[0],
      pw: info[1],
      email: info[2]
    }
    req.session.destroy();
    next();
  } else {
    let result = {
      err: true,
      data: '已过期，请重新验证！'
    }
    res.json(result);
    res.end();
  }
}, (req, res, next) => {
  // console.log(req.userInfo);
  mysql.addSql(req.userInfo, (flag, data) => {
    if (flag) {
      let result = {
        err: true,
        data: '数据库添加失败！',
        result: data
      }
      res.json(result);
      res.end();
    } else {
      let result = {
        err: false,
        data: 'success'
      }
      res.json(result);
      res.end();
    } 
  })
})

module.exports = router;