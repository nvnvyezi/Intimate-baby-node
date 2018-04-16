const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const test = require('./test');
const bookRem = require('./book-recommend');
const bookRec = require('./book-recom');
const movieRem = require('./movie-recommend');
const bookList = require('./book-list');
const allList = require('./list-all');

const app = express();

app.use(cors()); 
app.use(bodyParser.json());

app.use('/test', test);
app.use('/bookRem', bookRem);
app.use('/movieRem', movieRem);
app.use('/bookRec', bookRec);
app.use('/bookList',bookList);
app.use('/allList', allList);

app.listen(3000, () => {
  console.log('3000 is running');
})
