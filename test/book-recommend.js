const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/', function (req, res) {
  const options = {
    url: 'https://www.dingdiann.com/',
    method: 'get',
    // encoding: null,
    json: true
  }
  request(options, function (err, response, body) {
    // console.log(options);
    if (!err && response.statusCode == 200) {
      // console.log(1);
      // console.log(body);
      let imgArr = {};
      // let imgNameArr = [];
      const $ = cheerio.load(body);
      let img1 = $('#novelslist1').find('img');
      let img2 = $('#novelslist2').find('img');
      for (let i = 0; i < img1.length; i++) {
        // imgArr.push('https://www.dingdiann.com/' + img1[i].attribs.src);
        // imgNameArr.push(img1[i].attribs.alt);
        let name = img1[i].attribs.alt;
        let name1 = 'https://www.dingdiann.com/' + img1[i].attribs.src;
        // [].push.apply(imgArr, )
        imgArr[name] = name1
      }
      for (let i = 0; i < img2.length; i++) {
        // imgArr.push('https://www.dingdiann.com/' + img2[i].attribs.src);
        // imgNameArr.push(img2[i].attribs.alt);
        let name = img2[i].attribs.alt;
        let name1 = 'https://www.dingdiann.com/' + img2[i].attribs.src;
        // [].push.apply(imgArr, )
        imgArr[name] = name1
      }
      // console.log(imgArr);
      let result = {
        err: false,
        result: imgArr
      }
      res.jsonp(result);
      res.end();
    } else {
      // console.error(err, '')
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