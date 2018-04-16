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
      let nameList = [];
      // console.log(list[0].children[0].data);
      for (let i = 0; i < list.length; i++) {
        nameList.push(list[i].children[0].data.trim())
      }
      // console.log(nameList);
      let result = {
        err: false,
        result: nameList
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