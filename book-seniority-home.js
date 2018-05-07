const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res) => {
  const options = {
    url: 'http://xiaoshuo.uc.cn/',
    method: 'get'
  }

  request(options, function (err, response, body) {  
    if (!err && response.statusCode === 200) {
      const $ = cheerio.load(body);
      let list = $('.rank-info');
      console.log(list.length);
      console.log(body);
      let result = {
        err: false,
        result: {
          // data: list
        }
      }
      res.jsonp(result);
      res.end();
    }else {
      let result = {
        err: true,
        result: {
          err: '爬取原网页失败'
        }
      }
      res.jsonp(result);
      res.end();
    }
  })
})

module.exports = router;