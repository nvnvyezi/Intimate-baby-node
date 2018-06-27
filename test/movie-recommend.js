const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/', function (req, res) {
  const options = {
    url: 'https://www.80s.mx/',
    method: 'get',
    // encoding: null,
    json: true
  }
  request(options, function (err, response, body) {
    // console.log(response.statusCode);
    console.log(body);
    if (!err && response.statusCode == 200) {
      let imgArr = {};
      const $ = cheerio.load(body);
      let img1 = $('img_22111_110968').attr('src');
      console.log(img1);
      console.log(object);
      let result = {
        err: false,
        result: imgArr
      }
      res.jsonp({'sd': 'ds'});
      res.end();
    } else {
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