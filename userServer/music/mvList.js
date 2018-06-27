const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res, next) => {
  const options = {
    url: `http://www.170mv.com/mlmv`,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      // 'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Cookie': 'Hm_lvt_e0c54c20c6d432ce8080ff8469b712cd=1528635560; is_shared=1; bottom_mob=20; Hm_lpvt_e0c54c20c6d432ce8080ff8469b712cd=1528701963',
      'Host': 'www.170mv.com',
      'If-Modified-Since': 'Sat, 19 May 2018 21:23:26 GMT',
      'Referer': 'http://www.170mv.com/mlmv',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
    }
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const $ = cheerio.load(body);
      try {
        let sel1 = $('#artist');
        let sel2 = $('#version');
        let sel3 = $('#definition');
        // console.log(sel1[0].children[0])
        const opt1 = [], opt2 = [], opt3 = [];
        for (let i = 0, len = sel1[0].children.length; i < len; i++) {
          let obj = {};
          obj.val = sel1[0].children[i].attribs.value;
          obj.text = sel1[0].children[i].children[0].data;
          opt1.push(obj);
        } 
        for (let i = 0, len = sel2[0].children.length; i < len; i++) {
          let obj = {};
          obj.val = sel2[0].children[i].attribs.value;
          obj.text = sel2[0].children[i].children[0].data;
          opt2.push(obj);
        } 
        for (let i = 0, len = sel3[0].children.length; i < len; i++) {
          let obj = {};
          obj.val = sel3[0].children[i].attribs.value;
          obj.text = sel3[0].children[i].children[0].data;
          opt3.push(obj);
        } 
        res.json({err: false, data: '成功', result: {opt1, opt2, opt3}});
        res.end();
      } catch (err) {
        let result = {
          err: true,
          data: '爬取ｍｖ失败',
          result: err
        }
        res.json(result);
        res.end();
      }
    } else {
      let result = {
        err: true,
        data: '爬取ｍｖ失败',
        result: err
      }
      res.json(result);
      res.end();
    }
  })
})

module.exports = router;