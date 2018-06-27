const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/', (req, res, next) => {
  let mid = req.query.mid || '004DQHnG4f1tyI';
  let filename = `C400${mid}.m4a`
  const options = {
    url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&songmid=${mid}&filename=${filename}&guid=652943595`,
    method: 'get',
  };
  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      let song = JSON.parse(body);
      res.json(song);
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
