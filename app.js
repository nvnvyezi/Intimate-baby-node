const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// 接受form-data数据
const multipart = require('connect-multiparty'); 

// const test = require('./test');
// const bookRem = require('./book-recommend');
// const bookRec = require('./book-recom');
// const movieRem = require('./movie-recommend');
// const bookList = require('./book-list');
// const allList = require('./list-all');
// const bookSeniorityHome = require('./book-seniority-home')
// const bookSearch = require('./bookSearch');
const chapter = require('./book-chapter/chapter');

const login = require('./login');
const register = require('./login/register');
const activate = require('./login/activate');
const test = require('./book-chapter/test');

// 读取密钥和签名证书
const options = {
  key: fs.readFileSync('./ca/server.key'),
  cert: fs.readFileSync('./ca/server.crt')
}

const app = express();
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

// app.use(bodyParser.json())
app.use(cors()); 
app.use(multipart());
app.use(cookieParser('nvnvyezi'));
app.use(session({
  secret: 'nvnvyezi',
  name: 'activate',
  cookie: {
    maxAge: 72000
  }
}))

app.use('/register', bodyParser(), register);
app.use('/login', bodyParser.json({
  limit: '1kb', //请求最大数据量
  strict: true   //解析array，object格式
}) ,login);
app.use ('/activate', activate);
app.use('/chapter', chapter);
app.use('/test', test);
// app.use('/login', login);

// app.use('/test', test);
// app.use('/bookRem', bookRem);
// app.use('/movieRem', movieRem);
// app.use('/bookRec', bookRec);
// app.use('/bookList',bookList);
// app.use('/allList', allList);

// app.use('/bookSeniorityHome', bookSeniorityHome);
// app.use('/bookSearch', bookSearch);

// app.listen(3000, () => {
//   console.log('3000 is running');
// })

// 开启https服务
httpsServer.listen(3000, () => {
  console.log( `httpsServer is 3000`);
})

// 开启http服务
// httpServer.listen(3001, () => {
//   console.log(`httpServer is 3001`);
// })