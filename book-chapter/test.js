const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const router = express.Router();

router.get('/', (req, res, next) => {
  const options = {
    url: 'http://xiaoshuo.uc.cn/#!/cid/803512/bid/7138615/ct/read',
    // encoding: null
  }

  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      // console.log(body);
      res.send(body);
      res.end();
    }
  })
})

module.exports = router;