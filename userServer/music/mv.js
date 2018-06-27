const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res, next) => {
  const list = req.query.list || 'mlmv';
  const tags = req.query.tags || '';
  let url = '';
  if (!tags && tags == '') {
    url = `http://www.170mv.com/${list}`;
  } else {
    url = `http://www.170mv.com/${list}?order=desc&tag=${encodeURIComponent(tags)}`;
  }
  // console.log(url)
  const options = {
    url,
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
      // console.log(body)
      const $ = cheerio.load(body);
      try {      
        let nag = $('.nag');
        const a = nag.find('.clip-link');
        const img = nag.find('img');
        const time = nag.find('.entry-date');
        const readers = nag.find('.entry-meta').find('.count');
        const mvArr = [];
        for (let i = 0, len = img.length; i < len; i++) {
          let obj = {};
          obj.mvUrl = a[i].attribs.href;
          obj.imgUrl = img[i].attribs['data-original'];
          obj.name = img[i].attribs.alt;
          obj.time = time[i].attribs['datetime']
          obj.readers = readers[i].children[0].data;
          mvArr.push(obj);
        }
        res.json({err: false, data: '成功', result: mvArr});
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
