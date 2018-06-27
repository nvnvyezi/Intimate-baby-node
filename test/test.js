const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  let result = {
    sd: 'sd',
    bbj: 'bbj'
  }
  res.jsonp(result);
  res.end();
})

router.post('/', (req, res) => {
  const str = req.body;
  // console.log('str', str)
  res.writeHead(404, {
    'Content-Type': 'json'
  });
  let result = {
    sg: 'post',
    dd: 'bbj',
    data: str
  }
  // res.json(result);
  res.end();
})

module.exports = router;