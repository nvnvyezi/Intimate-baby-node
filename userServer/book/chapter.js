const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const cache = require('memory-cache');

const router = express.Router();

router.get('/', (req, res, next) => {
  req.page = req.query.page || 0;
  let bookName = req.query.bookName || '农女致富记';
  req.name = bookName;
  let author = req.query.author || '秦喜儿';
  // console.log(bookName, author)
  const options = {
    url: `https://www.35xs.com/book/search?keyword=${encodeURIComponent(bookName)}`,
    encoding: null
  }
  if (!cache.get(bookName)) {
    request(options, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        body = iconv.decode(body, 'utf8');
        let $ = cheerio.load(body);
        let flag = false;
        let el = $('td');
        if (!el.length) {
          let result = {
            err: true,
            data: '没找到',
            result: '哎呀,1.1错了！'
          }
          res.json(result);
          res.end();
          return;
        } else {
          Array.prototype.forEach.call($('tr'), (item, index) => {
            try {
              if (index !== 0) {
                // console.log(item.childre[0].children[9]);
                // console.log(item.children[1].children[0].data);
                if (item.children[0].children[0].children[0].data === bookName && item.children[1].children[0].data == author) {
                  let href = item.children[0].children[0].attribs.href;
                  req.list = `https://www.35xs.com${href}`;
                  // console.log(req.list);
                }
              }
            } catch (error) {
              flag = true;
            }
          })
          if (flag && !req.list) {
            let result = {
              err: true,
              data: '爬到书了，但是处理出错',
              result: '哎呀,1.2错了！'
            }
            res.json(result);
            res.end();
          } else {
            next();
          }
        }
      } else {
        let result = {
          err: true,
          data: '没有爬到书',
          result: '哎呀,1.3错了！'
        }
        res.json(result);
        res.end();
      }
    })
  } else {
    next();
  }
}, (req, res, next) => {
  const options = {
    url: req.list,
    encoding: null
  }
  let flag = false;
  if (!cache.get(req.name)) {  
    request(options, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        body = iconv.decode(body, 'utf8');
        cache.put(req.name, body, 90000, function() {
          console.log(req.name, '缓存成功');
        })
        let $ = cheerio.load(body);
        let li = $('.mulu_list').find('li');
        // console.log(li)
        try {
          req.chapter = `https://www.35xs.com${ li[req.page].children[0].attribs.href }`;
          // console.log(req.chapter)
        } catch (error) {
          flag = true;
        }
        if (flag && !req.chapter) {
          let result = {
            err: true,
            data: '爬到书了，但是获取章节处理数据出错',
            result: '哎呀， 2.1错了！'
          }
          res.json(result);
          res.end();
        } else {
          next();
        }
      } else {
        let result = {
          err: true,
          data: err,
          result: '哎呀，，没有爬到章节， 2.2错了！'
        }
        res.json(result);
        res.end();
      }
    })
  } else {
    let body = cache.get(req.name);
    let $ = cheerio.load(body);
    let li = $('.mulu_list').find('li');
    // console.log(li)
    try {
      req.chapter = `https://www.35xs.com${ li[req.page].children[0].attribs.href }`;
      // console.log(req.chapter)
    } catch (error) {
      flag = true;
    }
    if (flag && !req.chapter) {
      let result = {
        err: true,
        data: '爬到书了，但是获取章节处理数据出错',
        result: '哎呀， 2.1错了！'
      }
      res.json(result);
      res.end();
    } else {
      next();
    }
  }
}, (req, res) => {
  const options = {
    url: req.chapter,
    encoding: null
  }
  let flag = false;
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      body = iconv.decode(body, 'utf8');
      const $ = cheerio.load(body);
      // console.log($('#chaptercontent').text());
      // console.log($('.story_title').find('h1').text())
      try {
        let chapter = $('.story_title').find('h1').text();
        let text = `${ $('.story_title').find('h1').text() }                      
        
                    ${ $('#chaptercontent').text() }`;
        let result = {
          err: false,
          chapter,
          text: text.replace('闪舞小说网www.35xs.com', '')
        }
        res.json(result);
        res.end();
      } catch (error) {
        flag = true;
      }
      if (flag && !chapter && !text) {
        let result = {
          err: true,
          data: '处理出错',
          result: '哎呀，3.1错了！'
        }
        res.json(result);
        res.end();
      }
    } else {
      let result = {
        err: true,
        data: err,
        result: '哎呀，3.2错了！'
      }
      res.json(result);
      res.end();
    }
  })
})

module.exports = router;