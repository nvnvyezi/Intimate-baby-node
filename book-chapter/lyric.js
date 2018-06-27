const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/', (req, res, next) => {
  let mid = req.query.mid || '004DQHnG4f1tyI';
  let date = new Date().getTime();
  const options = {
    url: `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?pcachetime=${date}&songmid=${mid}&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
    method: 'get',
    headers: {
      Referer: 'https://y.qq.com/portal/player.html'
    }
  };
  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      // let song = JSON.parse(body);
      let start = body.indexOf('"lyric"');
      let end = body.indexOf('","trans":');
      let data = body.slice(start + 8, end);
      res.json(data);
      res.end();
    } else {
      let result = {
        err: true,
        data: '获取歌曲错误'
      }
      res.json(result);
      res.end();
    }
  })
})

module.exports = router;
