const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// 注册
const register = require('./login/register');
const activate = require('./login/activate');

// 登录
const login = require('./login/login');
const logout = require('./login/logout');

// 更改信息
const upload = require('./user/upload');
const comments = require('./user/comments');
const sendCom = require('./user/sendCom');

// 音乐
const music = require('./music/musicList');
const song = require('./music/song');
const lyric = require('./music/lyric');
const mv = require('./music/mv');
const mvPlay = require('./music/mv-play')
const mvForward = require('./music/mv-forward')
const mvList = require('./music/mvList')

// 小说
const chapter = require('./book/chapter');
const shelf = require('./book/bookshelf');

// 读取密钥和签名证书
const options = {
  key: fs.readFileSync('./ca/server.key'),
  cert: fs.readFileSync('./ca/server.crt')
}

const app = express();
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:8080',
  // origin: 'http://193.112.4.143',
  credentials: true  // 是否带cookie
}));
// app.use(multipart());
app.use(cookieParser('nvnvyezi'));
app.use(session({
  secret: 'nvnvyezi',
  name: 'ny-id',
  cookie: {
    maxAge: 720000
  }
}))
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', (req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
//   if (req.method == 'OPTIONS') {
//     res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
//   }
//   else {
//     next();
//   }
// })
app.use('/register', bodyParser(), register);
app.use('/login', bodyParser.json({
  limit: '1kb', //请求最大数据量
  strict: true   //解析array，object格式
}) ,login);
app.use ('/activate', activate);
app.use ('/logout',bodyParser.json({
  limit: '1kb', //请求最大数据量
  strict: true   //解析array，object格式
}), logout);

app.use('/chapter', chapter);
app.use('/music', music);
app.use('/song', song);
app.use('/lyric', lyric);
app.use('/shelf', shelf);
app.use('/mv', mv);
app.use('/mvPlay', mvPlay);
app.use('/mvForward', mvForward);
app.use('/mvList', mvList);

app.use('/getcom', sendCom);
app.use('/upload', upload);
app.use('/comments',bodyParser.json({
  limit: '1kb', //请求最大数据量
  strict: true   //解析array，object格式
}), comments);
// let uploa = multer({storage: storage});
// app.post('/upload', uploa.array('user', 6), (req, res, next) => {
//   console.log(req.files, req.body);
//   res.json('sd');
//   res.end();
// });

// app.listen(3000, () => {
//   console.log('3000 is running');
// })

// 开启https服务
httpsServer.listen(3002, () => {
  console.log( `httpsServer is 3002`);
})

// 开启http服务
httpServer.listen(3003, () => {
  console.log(`httpServer is 3003`);
})
