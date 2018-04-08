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
    // headers: {
    //   'Accept': 'text / html, application/xhtml+xml,application/xml; q=0.9, image/webp,image/apng, */*;q=0.8',
    //   'Accept-Encoding': 'gzip, deflate, br',
    //   'Accept-Language': 'zh-CN,zh;q=0.9',
    //   'Cache-Control': 'max-age=0',
    //   'Connection': 'keep-alive',
    //   'Cookie': 'UM_distinctid=16261703f43190-0acc8158809b81-3b7c015b-1fa400-16261703f442f1; CNZZDATA1256857442=1116176056-1522048502-%7C1522048502',
    //   'Host': 'www.dingdiann.com',
    //   'If-Modified-Since': 'Sun, 25 Mar 2018 12:48:26 GMT',
    //   'Upgrade-Insecure-Requests': 1,
    //   'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    // }
  }
  request(options, function (err, response, body) {
    // console.log(response.statusCode);
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