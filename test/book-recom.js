const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/', function (req, res) {
  const options = {
    url: 'https://www.dingdiann.com/',
    method: 'get',
    // encoding: null,
    json: true,
  }
  request(options, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      let arr = [];
      const $ = cheerio.load(body);
      let list = $('.l').find('.s1');
      let list2 = $('.l').find('.s2');
      let list4 = $('.l').find('.s4');
      for (let i = 0; i < list.length; i++) {
        let str = {}
        let name = list[i].children[0].data;
        let name1 = list2[i].children[0].children[0].data;
        // console.log(list4[i].children[0])
        let name2 = list4[i].children.data;
        str['bookName'] = name1;
        str['author'] = name2;
        str['typ'] = name;
        str['sort'] = i+1;
        arr.push(str);
      }
      // console.log(arr, '')
      let result = {
        err: false,
        result: arr
      }
      res.jsonp(result);
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