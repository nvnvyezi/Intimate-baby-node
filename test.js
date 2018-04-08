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

module.exports = router;