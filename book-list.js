const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res) => {
  const options = {
    url: 'https://m.dingdiann.com/sort/0/1.html',
    method: 'get'
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(body);
      let list = $('.sortChannel_nav').find('a');
      console.log(list);
    }
    let result = {
      err: false,
      result: 'sd'
    }
    res.jsonp(result);
    res.end();
  })
})

module.exports = router;