const express = require('express');

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
  // console.log(vfCode)
  let state = {
    err: false,
    data: '欢迎注册'
  }
  res.json(state);
  res.end();
})

router.post('/', (req, res, next) => {
  console.log(req.headers)
  const id = req.body.id || 'nvnvyezi*';
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
    next();
  }).catch((data) => {
    console.log(data)
    let errArr = ['用户名', '密码', '验证码', '邮箱'];
    let result = {
      err: true,
      data: `${errArr[data]}格式错误`
    }
    res.json(result);
    res.end();
  })
}, (req, res, next) => {
  
})

module.exports = router;
