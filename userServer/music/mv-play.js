const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res) => {
  let uri = req.query.uri;
  // console.log(uri)
  const options = {
    url: uri,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      // 'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Cookie': 'Hm_lvt_e0c54c20c6d432ce8080ff8469b712cd=1528635560; is_shared=1; Hm_lpvt_e0c54c20c6d432ce8080ff8469b712cd=1528710753; bottom_mob=2',
      'Host': 'www.170mv.com',
      // 'If-Modified-Since': 'Sat, 19 May 2018 21:23:26 GMT',
      'Referer': 'http://www.170mv.com/mlmv',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
    }
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const $ = cheerio.load(body);
      try {
        const video = $('.screen');
        const content = $('.rich-content');
        const a = $('#extras').find('a');
        let p = content[0].children[5];
        let text = '';
        let text1 = '';
        for (let i = 0, len = p.children.length; i < len; i++) {
          let data = p.children[i];
          if (data.type == 'text') {
            text += data.data;
          } else if (data.type == 'tag' && data.name == 'a') {
            text += data.children[0].data;
          }
        }
        let p1 = content[0].children[7];
        if (p1.type == 'tag' && p1.name == 'p') {
          text1 = p1.children[0].data;
        }
        const mvUrl = video[0].children[1].children[0].data;
        // console.log(mvUrl[0].children[1])
        let tag = '', tag1 = '', tag2 = '';
        for (let i = 0, len = a.length; i < len; i++) {
          if (i == 0) {
            tag = a[i].children[0].data;
          } else if (i == len - 1) {
            tag2 = a[i].children[0].data;
          } else {
            tag1 += a[i].children[0].data;
          }
        }
        // console.log(a[0].children[0].data)
        let result = {
          err: false,
          data: '成功',
          url: mvUrl,
          text,
          text1,
          tag,
          tag1,
          tag2
        }
        res.json(result);
        res.end();
      } catch (err) {
        let result = {
          err: true,
          data: '获取信息出错哦',
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