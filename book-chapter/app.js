const express = require('express');
// const https = require('https');
// const http = require('http');
// const fs = require('fs');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// 接受form-data数据
// const multipart = require('connect-multiparty'); 

const music = require('./musicList');
const chapter = require('./chapter');
const song = require('./song');
const lyric = require('./lyric');
// 读取密钥和签名证书
// const options = {
//   key: fs.readFileSync('./ca/server.key'),
//   cert: fs.readFileSync('./ca/server.crt')
// }

const app = express();
// const httpsServer = https.createServer(options, app);
// const httpServer = http.createServer(app);

// app.use(bodyParser.json())
app.use(cors()); 
// app.use(multipart());
// app.use(cookieParser('nvnvyezi'));
// app.use(session({
//   secret: 'nvnvyezi',
//   name: 'activate',
//   cookie: {
//     maxAge: 192000
//   }
// }))
app.use('/chapter', chapter);
app.use('/music', music);
app.use('/song', song);
app.use('/lyric', lyric);

app.listen(3001, () => {
  console.log('3001 is running');
})

// 开启https服务
// httpsServer.listen(3000, () => {
//   console.log( `httpsServer is 3000`);
// })

// 开启http服务
// httpServer.listen(3001, () => {
//   console.log(`httpServer is 3001`);
// })