const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/', (req, res) => {
  const keyword = req.query.keyword || '元尊';
  
  const options = {
    url: 'http://g.hongshu.com/bookajax/search.do?keyword=' + keyword,
    method: 'get'
  }
  console.log(options.url)
  request(options, function (err, response, body) {
    // console.log(body)
    if (!err && response.statusCode === 200) {
      // console.log(body)
      // const $ = cheerio.load(body);
      // let list = $('.result-list').find('li');

      // console.log(list[0].children[1]);
      res.jsonp(JSON.parse(body));
      res.end();
    }
  })
})

module.exports = router;