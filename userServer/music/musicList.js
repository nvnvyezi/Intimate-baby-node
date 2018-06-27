const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/', (req, res, next) => {
  const options = {
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?tpl=3&page=detail&date=2018_21&topid=26&type=top&song_begin=0&song_num=30&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
    // url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    method: 'get',
  };
  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      let songList = JSON.parse(body).songlist;
      let arr = [];
      for (let i = 0, len = songList.length; i < len; i++) {
        let obj = {};
        obj.name = songList[i].data.songname;
	obj.albummid = songList[i].data.albummid;
        obj.mid = songList[i].data.songmid;
        arr.push(obj);
      }
      let result = {
        err: false,
        result: arr
      }
      res.json(result);
      res.end();
    } else {
      let result = {
        err: true,
        data: '获取歌单错误'
      }
      res.json(result);
      res.end();
    }
  })
})

module.exports = router;
