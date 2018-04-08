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
    // console.log(response.statusCode);
    if (!err && response.statusCode == 200) {
      // console.log(1);
      // console.log(body);
      let arr = [];
      // let imgNameArr = [];
      const $ = cheerio.load(body);
      // let img1 = $('#newscontent').find('li');
      // console.log(img1[0])
      let list = $('.l').find('.s1');
      // console.log(list[6].children[0].data);
      let list2 = $('.l').find('.s2');
      // console.log(list2[6].children[0].children[0].data);
      // let list3 = $('.l').find('.s3');
      // console.log(list3[6].children[0].children[0].data);
      let list4 = $('.l').find('.s4');
      // console.log(list4[6].children[0].data);
      // console.log(list.length);
      // console.log(list2.length);
      // console.log(list4.length);
      for (let i = 0; i < list.length; i++) {
        let str = {}
        let name = list[i].children[0].data;
        let name1 = list2[i].children[0].children[0].data;
        let name2 = list4[i].children[0].data;
        str['bookName'] = name1;
        str['author'] = name2;
        str['typ'] = name;
        str['sort'] = i+1;
        arr.push(str);
      }
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