const express = require('express');
const mysql = require('../mysql/mysql');
const router = express.Router();

function query(res) {
  mysql.findComAll((flag, dat) => {
    if (!flag) {
      for (let i = 0; i < dat.length; i++) {
        res.write(`data: ${JSON.stringify(dat[i])}\n\n`);
      }
    } else {
      res.write(`data: ${'获取出错'}\n\n`);
    }
  })
}

router.get('/', (req, res, next) => {
  res.writeHead(200, {"Content-Type":"text/event-stream", 
                            "Cache-Control":"no-cache", 
                            "Connection":"keep-alive"});
  res.write(`retry: 10000\n`);
  query(res);
  let interval = setInterval(() => {
    query(res);
  }, 3000);
  req.connection.addListener("close", function () {
    clearInterval(interval);
  }, false);
});
module.exports = router;
