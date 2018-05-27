const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('../mysql/mysql');

const router = express.Router();

router.get('/', (req, res) => {
  let chars = 'ABCDEFGHIJKMNOPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
  let vfCode = '';
  for (let i = 0; i < 4; i++) {
    vfCode += chars[Math.floor(Math.random() * chars.length)];
  }
  res.cookie('vfCode', vfCode, {
    httpOnly:true,
    maxAge: 72000,
    signed: true,
    secure: true,        //标记为与https一起用
    path: '/register'
  })
  let state = {
    err: false,
    data: '欢迎注册'
  }
  res.json(state);
  res.end();
})

router.post('/',(req, res, next) => {
  if (req.headers.origin === '127.0.0.1') {
    if (req.signedCookies.vfCode) {      
      next();
    } else {
      let result = {
        err: true,
        data: '验证码过期'
      }
      res.json(result);
      res.end();
    }
  } else {
    let result = {
      err: true,
      data: '非正常？'
    }
    res.json(result);
    res.end();
  }
}, (req, res, next) => {
  const id = req.body.id || 'nvnvyezi';
  const pw = req.body.pw || '521zhuzhu**';
  const code = req.body.code || 'as23';
  const email = req.body.email || '118@qq.com';
  let regId = /^[a-zA-Z0-9_-]{4,16}$/;
  // 密码包含大写字母、小写字母、数字、特殊符号中的至少三类，且长度在8到20之间。
  let regPw = /^(?!([A-Z]*|[a-z]*|[0-9]*|[!-/:-@\[-`{-~]*|[A-Za-z]*|[A-Z0-9]*|[A-Z!-/:-@\[-`{-~]*|[a-z0-9]*|[a-z!-/:-@\[-`{-~]*|[0-9!-/:-@\[-`{-~]*)$)[A-Za-z0-9!-/:-@\[-`{-~]{8,20}$/;
  let regCode = /^[A-Za-z0-9]+$/;
  let regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

  const regJudge = function () {
    return new Promise(function (resolve, reject) {
      let count = 0;
      function* Generator () {
        yield regId.test(id);
        yield regPw.test(pw);
        yield regCode.test(code);
        yield regEmail.test(email);
        return false;
      }
      let judge = Generator();
      while (judge.next().value) {
        count++;
      }
      if (count === 4) {
        resolve()
      } else {
        reject(count);
      }
    })
  }
  regJudge().then((data) => {
    req.session.activate = `${ id }|nvnv|${ pw }|nvnv|${ email }`;
    next();
  }).catch((data) => {
    // console.log(data)
    let errArr = ['用户名', '密码', '验证码', '邮箱'];
    let result = {
      err: true,
      data: `${errArr[data]}格式错误`
    }
    res.json(result);
    res.end();
  })
},(req, res, next) => {
  mysql.findSql(req.body.id, (flag, data) => {
    if (flag) {
      let result = {
        err: true,
        data: '数据库查找错误',
        result: data
      }
      res.json(result),
      res.end();
    } else {
      if (!data.length) {
        next();
      } else {
        let result = {
          err: true,
          data: '账号存在'
        }
        res.json(result),
        res.end();
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
    text: '点击激活：https://127.0.0.1:3000/activate' //接收激活请求的链接
  };
  // transporter.sendMail(mail, function(error, info){
  //   if(error) {
  //     let result = {
  //       err: true,
  //       data: '邮箱发送失败！',
  //       result: error
  //     }
  //     res.json(result);
  //     res.end();
  //   } else {
      let result = {
        err: false,
        data: '发送正常',
        // result: `mail sent:', ${ info.response }`
      }
      res.send(result);
      res.end();
  //   }
  // });
})

module.exports = router;
