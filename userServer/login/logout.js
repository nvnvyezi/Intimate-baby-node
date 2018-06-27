const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const NODERSA = require('node-rsa');

const router = express.Router();

function code (req, res, flag, str) {
  let result = {
      err: flag,
      data: str
    }
  res.json(result);
  res.end();
}

router.post('/',(req, res, next) => {
  let vfCode = req.signedCookies.Identity;
  if (!req.session.identity) {
    code(req, res, true, '请先登录');
    return ;
  }
  let secret = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
  jwt.verify(vfCode, secret, {algorithm: 'HS512'}, (err, data) => {
    if (err) {
      code(req, res, true, 'token有问题');
      return ;
    } else {
      let currentTime = Math.floor(Date.now() / 1000); 
      // let userCode = data.vfCode;
      if (data.exp <= currentTime) {
        code(req, res, true, '请不要用过期的token');
        return ;
      }
      let token = req.session.identity;
      if (vfCode === token) {
        res.clearCookie('Identity', {
          httpOnly:true,
          maxAge: 72000,
          signed: true,
          // secure: true,        //标记为与https一起用
          path: '/'
        });
        req.session.destroy();
        let result = {
          err: false,
          data: '退出成功'
        }
        res.json(result);
        res.end();
      } else {
        code(req, res, true, 'token不对头');
        return ;
      }
    }
  })
})

module.exports = router;