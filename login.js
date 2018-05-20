const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
  let id = req.body.id;
  let password = req.body.password;

  res.json(req.body);
  res.end();
})


module.exports = router;
