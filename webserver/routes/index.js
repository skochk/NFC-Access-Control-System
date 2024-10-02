var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('test')
  res.send('working');
});
router.post('/send',function(req,res){
  console.log(req.body); 
  res.send('OK');
});

module.exports = router;
