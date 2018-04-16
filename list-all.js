const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

router.get('/', (req, res) => {
  let list = req.query.list || 0;
  let page = req.query.page || 1;
  const options = {
    url: 'https://m.dingdiann.com/sort/' + list +'/'+ page + '.html',
    method: 'get'
  }
  console.log(options.url, '')
  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(body);
      let list = $('#main').find('.hot_sale');
      let listArr = [];
      // console.log(list[0].children[1].children[1].children[1].attribs['data-original']);
      // console.log(list[0].children[3].children[1].children[1].children[1].children[0].data);
      // console.log(list[0].children[3].children[1].children[1].children[3].children[0].data);
      // console.log(list[0].children[5].children[1].data);
      for (let i = 0; i < list.length; i++) {
        let obj = {};
        obj.bookName = list[i].children[3].children[1].children[1].children[1].children[0].data;
        obj.author = list[i].children[3].children[1].children[1].children[3].children[0].data.replace(/作者：/, '');
        obj.imgUrl = list[i].children[1].children[1].children[1].attribs['data-original'];
        obj.summary = list[i].children[5].children[1].data.replace(/简介：/, '');
        listArr.push(obj)
      }
      let result = {
        err: false,
        result: listArr
      }
      res.jsonp(result);
      res.end();
    }else {
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