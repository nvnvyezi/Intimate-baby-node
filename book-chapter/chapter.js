const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const router = express.Router();

router.get('/', (req, res, next) => {
  req.page = req.query.page || 9;
  let bookName = req.query.bookName || '万古杀帝';
  const options = {
    url: `https://www.biquge5200.cc/modules/article/search.php?searchkey=${encodeURIComponent(bookName)}`,
    encoding: null
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      body = iconv.decode(body, 'gbk');
      let $ = cheerio.load(body);
      let result = null;
      let el = $('td');
      if (!el.length) {
          result = {
            err: true,
            data: '没找到',
            result: '哎呀,1.1错了！'
          }
          req.err = result;
      } else {
        let minNum = 0;
        Array.prototype.forEach.call($('tr'), (item) => {
          try {
            if (item.children[1].children[0].children[0].data === bookName) {
              let num = parseInt(item.children[7].children[0].data);
              if (num > minNum) {
                minNum = num;
                let href = item.children[1].children[0].attribs.href;
                req.list = href;
              }
              req.err = null;
            }
          } catch (error) {
            if (result === null) {
              result = {
                err: true,
                data: err,
                result: '哎呀,1.2错了！'
              }
              req.err = result;
            }
          }
        })
      }
    } else {
      console.log(err, 1)
    }
    next();
  })
}, (req, res, next) => {
  if (req.err !== null) {
    res.json(req.err);
    res.end();
    return ;
  }
  const options = {
    url: req.list,
    encoding: null
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      body = iconv.decode(body, 'gbk');
      let $ = cheerio.load(body);
      let dd = $('dd');
      // let arr = [];
      // for (let i = 9, len = dd.length; i < len; i++) {
      //   arr.push(dd[i].children[0].attribs.href);
      // }
      req.chapter = dd[req.page].children[0].attribs.href;
      req.err = null;
    } else {
      let result = {
        err: true,
        data: err,
        result: '哎呀， 2错了！'
      }
      req.err = result;
    }
    next();
  })
}, (req, res) => {
  if (req.err !== null) {
    res.json(req.err);
    res.end();
    return ;
  }
  const options = {
    url: req.chapter,
    encoding: null
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      body = iconv.decode(body, 'gbk');
      const $ = cheerio.load(body);
      let result = {
        err: false
      }
      result.bookName = $('.bookname')[0].children[1].children[0].data.trim();
      result.text = $('#content').text().trim().replace(/\s+/g, '|').split('|');
      // console.log(result)
      res.json(result);
      res.end();
    } else {
      let result = {
        err: true,
        data: err,
        result: '哎呀，3错了！'
      }
      res.json(result);
      res.end();
    }
  })
})

module.exports = router;