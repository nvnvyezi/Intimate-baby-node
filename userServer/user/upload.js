const express = require('express');
const mysql = require('../mysql/mysql');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();
const multer = require('multer');

// 图片路径
const storage = multer.diskStorage({
  // destination用于确定应该在哪个文件夹中存储上传的文件。这也可以作为string（例如'/tmp/uploads'）给出。如果否 destination，则使用操作系统的临时文件的默认目录。
  destination: function(req, file, cb) {
      cb(null, './img');
  },
  filename: function(req, file, cb) {
      cb(null, `${file.originalname}.jpg`)
  }
})
let createFolder = function(folder){
  try{
      // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
      // 如果文件路径不存在将会抛出错误"no such file or directory"
      fs.accessSync(folder); 
  }catch(e){
      // 文件夹不存在，以同步的方式创建文件目录。
      fs.mkdirSync(folder);
  }
};
let uploadFolder = './img/';
createFolder(uploadFolder);

let uploa = multer({storage: storage});

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
}, uploa.fields([{name: 'img'}]), (req, res, next) => {
  let img = null;
  if (req.file === undefined) {
    img = `http://193.112.4.143/img/${req.body.img}`;
  } else {
    img = `http://193.112.4.143/img/${req.file[0].filename}`;
    let result = {
      err: true,
      data: '图片太大了,请换个小图'
    }
    if (req.file[0].size > 10240) {
      res.json(result);
      res.end();
      return ;
    }
  }
  let data = {
    img,
    nickname: req.body.nickname,
    intro: req.body.intro || null,
    gender: req.body.gender == 'male' ? '男' : req.body.gender == 'female' ? '女' : null,
    birth: null
  }
  if (req.body.day != null && req.body.month != null && req.body.year != null) {
    data.birth = `${req.body.day}/${req.body.month}/${req.body.year}`;
  }
  // console.log(data);
  mysql.findSql(data.nickname, (flag, dat) => {
    if (flag) {
      res.json({err: true, data: '数据库查找错误'});
      res.end();
      return ;
    } else {
      if (dat.length == 0) {
        res.json({err: true, data: '没有此用户'});
        res.end();
        return ;
      } else {
        mysql.updateData(data, (flag, dat) => {
          if (flag) {
            res.json({err: true, data: '数据库修改错误', result: dat});
            res.end();
            return ;
          } else {
            let result = {
							err: false,
							data: '更改成功'
						};
						res.json(result);
						res.end();
          }
        })
      }
    }
  })
});
module.exports = router;
