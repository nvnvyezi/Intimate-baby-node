const express = require('express');
const mysql = require('../mysql/mysql');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();

function getIdentity (req, res) {
  let secret = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
  jwt.sign({id: req.id, iss: 'nvnvyezi', sub: 'token', exp: Math.floor(Date.now() / 1000) + 60 * 10},secret,{algorithm: 'HS512'}, (err, token) => {
    if (err) {
      code(req, res, 'token ERR');
      return ;
    } else {
      res.cookie('Identity', token, {
        httpOnly:true,
        // maxAge: 720000,
        signed: true,
        // secure: true,        //标记为与https一起用
        path: '/'
      })
      req.session.identity = token;
      // console.log(req.session)
      // let result ={
      //   err: false,
      //   data: '身份验证成功'
      // }
      // res.json(result);
      // res.end();
    }
  })
}

router.post('/', (req, res, next) => {
  if (!req.session.identity) {
    res.json({err: true, data: '您还未登录'});
    res.end();
    return ;
  }
  let vfCode = req.signedCookies.Identity;
  let secret = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
  jwt.verify(vfCode, secret, {algorithm: 'HS512'}, (err, data) => {
    if (err) {
      res.json({err: true, data: '没有权限'});
      res.end();
      return ;
    } else {
      let currentTime = Math.floor(Date.now() / 1000); 
      // let userCode = data.vfCode;
      if (data.exp <= currentTime) {
        res.json({err: true, data: '身份已过期'});
        res.end();
        return ;
      }
      let token = req.session.identity;
      if (vfCode === token) {
        getIdentity(req, res);
        next();
      } else {
        res.json({err: true, data: '身份验证错误'});
        res.end();
        return ;
      }
    }
  })
}, (req, res, next) => {
  let com = {
    bookId: req.body.bookId,
    id: req.body.id,
    text: req.body.text
  }
  // console.log(com)
  mysql.addComSql(com, (flag, dat) => {
    if (flag) {
      getIdentity (req, res)
      res.json({err: true, data: '评论添加错误'});
      res.end();
      return ;
    } else {
      getIdentity (req, res)
      res.json({err: false, data: '添加成功'});
      res.end();
      return ;
    }
  })
});
module.exports = router;
