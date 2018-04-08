const express = require('express');
const cors = require('cors');

const test = require('./test');
const bookRem = require('./book-recommend');
const bookRec = require('./book-recom');
const movieRem = require('./movie-recommend');
const bookList = require('./book-list');

const app = express();

app.use(cors()); 


app.use('/test', test);
app.use('/bookRem', bookRem);
app.use('/movieRem', movieRem);
app.use('/bookRec', bookRec);
app.use('/bookList',bookList);

app.listen(3000, () => {
  console.log('3000 is running');
})
