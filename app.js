const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

const app = express();

// app.use(bodyParser.json())
app.use(cors()); 
app.use(cookieParser('nvnvyezi'));

app.use('/register', bodyParser.json({
  limit: '1kb',
  strict: true
}), register);
app.use('/login', bodyParser.json({
  limit: '1kb', //请求最大数据量
  strict: true   //解析array，object格式
}) ,login);

app.use('/chapter', chapter);
// app.use('/login', login);

// app.use('/test', test);
// app.use('/bookRem', bookRem);
// app.use('/movieRem', movieRem);
// app.use('/bookRec', bookRec);
// app.use('/bookList',bookList);
// app.use('/allList', allList);

// app.use('/bookSeniorityHome', bookSeniorityHome);
// app.use('/bookSearch', bookSearch);

app.listen(3000, () => {
  console.log('3000 is running');
})
