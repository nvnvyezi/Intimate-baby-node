const express = require('express');
const mysql = require('../mysql/mysql');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(req.session.activate);
  if (req.session.activate) {
    const info = req.session.activate.split('|nvnv|');
    req.userInfo = {
      id: info[0],
      pw: info[1],
      email: info[2]
    }
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
  mysql.addSql(req.userInfo, (flag, data) => {
    if (flag) {
      let result = {
        err: true,
        data: '数据库添加失败！'
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