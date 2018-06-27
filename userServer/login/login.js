const express = require('express');
const mysql = require('../mysql/mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const NODERSA = require('node-rsa');

const router = express.Router();

function code (req, res, flag, str) {
  let chars = 'ABCDEFGHIJKMNOPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
  let vfCode = '';
  for (let i = 0; i < 4; i++) {
    vfCode += chars[Math.floor(Math.random() * chars.length)];
  }
  let payload = {
    iss: 'nvnvyezi',        // 发行者
    sub: 'vfCode',          // 主题
    exp: Math.floor(Date.now() / 1000) + 60 * 5,                // 过期时间
    vfCode
  }
  let secret = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
  jwt.sign(payload, secret, {algorithm: 'HS512'}, (err, token) => {
    if (err) {
      let result = {
        err: true,
        data: 'token ERR'
      }
      res.json(result);
      res.end();
    } else {
      res.cookie('vfCode', token, {
        httpOnly:true,
        maxAge: 72000,
        signed: true,
        // secure: true,        //标记为与https一起用
        path: '/login'
      })
      req.session.loginToken = token;
      // console.log(req.session.loginToken)
      let result = null;
      if (flag) {
        result = {
          err: true,
          data: str
        }
      } else {
        result = {
          err: false,
          data: str
        }
      }
      res.json(result);
      res.end();
      return ;
    }
  })
}

router.get('/', (req, res) => {
  code(req, res, false, '欢迎登陆');
})

router.post('/',(req, res, next) => {
  // console.log(req.session, 1)
  let vfCode = req.signedCookies.vfCode;
  // if (!vfCode) {
  //   code(req, res, true, '欢迎登陆');
  //   return;
  // }
  if (req.session.identity) {
    code(req, res, true, '您已经登陆了');
    return;
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
      let token = req.session.loginToken;
      if (vfCode === token) {
        res.clearCookie('vfCode', {
          httpOnly:true,
          maxAge: 72000,
          signed: true,
          // secure: true,        //标记为与https一起用
          path: '/login'
        });
        // req.userCode = userCode;
        req.session.loginToken = null;
        next();
      } else {
        code(req, res, true, 'token不对头');
        return ;
      }
    }
  })
}, (req, res, next) => {
	// console.log(req.body.id, req.body.pw);
	let privateKey = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
	const key = new NODERSA(privateKey);
	key.setOptions({encryptionScheme: 'pkcs1'});
	try {
		req.pw = key.decrypt(req.body.pw, 'utf-8') || '';
		req.id = key.decrypt(req.body.id, 'utf-8') || '';
	} catch (err) {
    code(req, res, true, `用户名或者密码格式错误`);
    return ;
  }
  let regId = /^[a-zA-Z0-9_-]{4,16}$/;
  // 密码包含大写字母、小写字母、数字、特殊符号中的至少三类，且长度在8到20之间。
  let regPw = /^(?!([A-Z]*|[a-z]*|[0-9]*|[!-/:-@\[-`{-~]*|[A-Za-z]*|[A-Z0-9]*|[A-Z!-/:-@\[-`{-~]*|[a-z0-9]*|[a-z!-/:-@\[-`{-~]*|[0-9!-/:-@\[-`{-~]*)$)[A-Za-z0-9!-/:-@\[-`{-~]{8,20}$/;
  // let regCode = /^[A-Za-z0-9]+$/;
  const Verification = function () {
    return new Promise((resolve, reject) => {
      let count = 0;
      function * Generator () {
        yield regId.test(req.id);
        yield regPw.test(req.pw);
        // yield regCode.test(req.code);
        return false;
      }
      let judge = Generator();
      while(judge.next().value) {
        count++;
      }
      if (count == 2) {
        resolve();
      } else {
        reject(count);
      }
    })
  }
  Verification().then((data) => {
    next();
  }).catch((data) => {
    let errArr = ['用户名', '密码', '验证码'];
    code(req, res, true, `${errArr[data]}格式错误`);
    return ;
  })
}, (req, res, next) => {
  mysql.findSql(req.id, (flag, data) => {
    if (flag) {
      code(req, res, true, `数据库查找错误`);
      return ;
    } else {
      if (data.length == 0) {
        code(req, res, true, '没有找到，快去注册一个吧');
        return ;
      } else {
        let pw = data[0].password;
        // if (req.code === req.userCode && pw === req.pw) {
        if (pw === req.pw) {
          next();
        } else {
          code(req, res, true, '密码错误');
          return ;
        }
      }
    }
  })
}, (req, res) => {
  let secret = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
  jwt.sign({id: req.id, iss: 'nvnvyezi', sub: 'token', exp: Math.floor(Date.now() / 1000) + 60 * 5},secret,{algorithm: 'HS512'}, (err, token) => {
    if (err) {
      code(req, res, 'token ERR');
      return ;
    } else {
      res.cookie('Identity', token, {
        httpOnly:true,
        maxAge: 72000,
        signed: true,
        // secure: true,        //标记为与https一起用
        path: '/'
      })
      req.session.identity = token;
      // console.log(req.session)
      let result ={
        err: false,
        data: '登陆成功'
      }
      res.json(result);
      res.end();
    }
  })
})

module.exports = router;