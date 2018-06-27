const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res) => {
  let uri = req.query.uri;
  // console.log(uri)
  const options = {
    url: 'http://www.170mv.com/tool/jiexi/ajax/pid/13116/vid/3223725.mp4',
    headers: {
      'Accept': '*/*',
      'Origin': 'http://www.170mv.com',
      'Referer': 'http://www.170mv.com',
      'Accept-Encoding': 'identity;q=1, *;q=0',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive',
      'Cookie': 'Hm_lvt_e0c54c20c6d432ce8080ff8469b712cd=1528635560; is_shared=1; Hm_lpvt_e0c54c20c6d432ce8080ff8469b712cd=1528723155',
      'Range': 'bytes=0-',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
    }
  }
  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      console.log(response.headers)
      try {
        res.json({err: false, data: '成功', result: body});
        res.end();
      } catch (err) {
        let result = {
          err: true,
          data: '爬取ｍｖ1失败',
          result: err
        }
        res.json(result);
        res.end();
      }
    } else {
      console.log(response)
      let result = {
        err: true,
        data: '爬取ｍｖ失败',
        result: err
      }
      res.json(response);
      res.end();
    }
  })
})

module.exports = router;