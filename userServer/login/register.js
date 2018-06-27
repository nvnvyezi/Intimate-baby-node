const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('../mysql/mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const NODERSA = require('node-rsa');

const router = express.Router();

function code (req, res, flag, str) {
  let chars = 'ABCDEFGHIJKMNOPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
  let vfCode = '', result;
  for (let i = 0; i < 4; i++) {
    vfCode += chars[Math.floor(Math.random() * chars.length)];
  }
  let payload = {
    iss: 'nvnvyezi',        // 发行者
    sub: 'register',          // 主题
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
      res.cookie('register', token, {
        httpOnly:true,
        maxAge: 72000,
        signed: true,
        // secure: true,        //标记为与https一起用
        path: '/register'
      })
      req.session.register = token;
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
      // console.log(req.signedCookies)
      res.json(result);
      res.end();
    }
  })
}

router.get('/', (req, res) => {
  code(req, res, false, '欢迎注册');
})

router.post('/',(req, res, next) => {
  // console.log(req.headers.origin)
  if (req.headers.origin === 'http://127.0.0.1:8080') {
    let register = req.signedCookies.register;
    let secret = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
    jwt.verify(register, secret, {algorithm: 'HS512'}, (err, data) => {
      if (err) {
        code(req, res, true, 'token 错误');
        return ;
      } else {
        let currentTime = Math.floor(Date.now() / 1000); 
        // let userCode = data.vfCode;
        if (data.exp <= currentTime) {
          code(req, res, true, '验证码过期');
          return ;
        }
        let token = req.session.register;
        if (register === token) {
          res.clearCookie('register', {
            httpOnly:true,
            maxAge: 72000,
            signed: true,
            // secure: true,        //标记为与https一起用
            path: '/register'
          });
          // req.userCode = userCode;
          req.session.register = null;
          next();
        } else {
          code(req, res, true, '过期的token请求');
          return ;
        }
      }
    })
  } else {
    let result = {
      err: true,
      data: '非正常？'
    }
    res.json(result);
    res.end();
  }
}, (req, res, next) => {
  let privateKey = fs.readFileSync(path.join(__dirname, '../ca/server.key'), 'utf-8');
	const key = new NODERSA(privateKey);
  key.setOptions({encryptionScheme: 'pkcs1'});
  let id, pw, email;
  try {
    id = key.decrypt(req.body.id, 'utf-8') || '';
    req.id = id;
    pw = key.decrypt(req.body.pw, 'utf-8') || '';
    req.pw = pw;
    //  code = req.body.code || 'as23';
    email = key.decrypt(req.body.email, 'utf-8') || '';
	} catch (err) {
    code(req, res, true, `用户名或者密码,邮箱格式错误`);
    return ;
	}
  req.email = email;
  let regId = /^[a-zA-Z0-9_-]{4,16}$/;
  // 密码包含大写字母、小写字母、数字、特殊符号中的至少三类，且长度在8到20之间。
  let regPw = /^(?!([A-Z]*|[a-z]*|[0-9]*|[!-/:-@\[-`{-~]*|[A-Za-z]*|[A-Z0-9]*|[A-Z!-/:-@\[-`{-~]*|[a-z0-9]*|[a-z!-/:-@\[-`{-~]*|[0-9!-/:-@\[-`{-~]*)$)[A-Za-z0-9!-/:-@\[-`{-~]{8,20}$/;
  // let regCode = /^[A-Za-z0-9]+$/;
  let regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

  const regJudge = function () {
    return new Promise(function (resolve, reject) {
      let count = 0;
      function* Generator () {
        yield regId.test(id);
        yield regPw.test(pw);
        // yield regCode.test(code);
        yield regEmail.test(email);
        return false;
      }
      let judge = Generator();
      while (judge.next().value) {
        count++;
      }
      if (count === 3) {
        resolve()
      } else {
        reject(count);
      }
    })
  }
  regJudge().then((data) => {
    next();
  }).catch((data) => {
    // console.log(data)
    let errArr = ['用户名', '密码', '验证码', '邮箱'];
    code(req, res, true, `${errArr[data]}格式错误,验证码更新3`);
  })
},(req, res, next) => {
  mysql.findSql(req.id, (flag, data) => {
    if (flag) {
      code(req, res, true, '数据库查找错误,验证码更新4');
      return;
    } else {
      if (!data.length) {
        next();
      } else {
        code(req, res, true, '账号存在，验证码更新6');
        return ;
      }
    }
  })
},(req, res, next) => {
  // 创建一个SMTP客户端配置
  const config = {
    service: '126',
    auth: {
        user: 'nvnvyezi@126.com', //刚才注册的邮箱账号
        pass: 'nvnvyezi724150'  //邮箱的授权码，不是注册时的密码
    }
  };
  const transporter = nodemailer.createTransport(config);

  const mail = {
    // 发件人
    from: 'nvnvyezi@126.com',
    // 主题
    subject: '激活帐号',
    // 收件人
    to: '1187128658@qq.com',
    // 邮件内容，HTML格式
    text: '点击激活：https://127.0.0.1:3001/activate' //接收激活请求的链接
  };
  transporter.sendMail(mail, function(error, info){
    if(error) {
      code(req, res, true, '验证码更新4');
      let result = {
        err: true,
        data: '邮箱发送失败！',
        result: error
      }
      res.json(result);
      res.end();
    } else {
      req.session.activate = `${ req.id }|nvnv|${ req.pw }|nvnv|${ req.email }`;
      let result = {
        err: false,
        data: '激活邮件发送正常',
        // result: `mail sent:', ${ info.response }`
      }
      res.send(result);
      res.end();
    }
  });
})

module.exports = router;
