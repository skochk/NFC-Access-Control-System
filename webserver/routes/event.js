let express = require('express');
let router = express.Router();
let eventController = require('../controllers/event');
var multer  = require('multer');
const path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage: storage });




router.post('/registertag', async function(req,res){  
  let data = req.body.payload;
  // console.log('in route',data.coords);
  let registeredUser = await eventController.isRegistered(data);
  let setupGeo = await eventController.registerGeo(data.tagInfo.id,data.coords);
  let makeLog = await eventController.registerLog(data.tagInfo.id,"scan",req.body.author,req.ip.replace('::ffff:', ''));
  if(!registeredUser){
    let respond = await eventController.add(data);
    let makeRegisterLog = await eventController.registerLog(data.tagInfo.id,"registertag",req.body.author,req.ip.replace('::ffff:', ''));
    res.send({status:"notregistered",payload:respond});
  }else{
    res.send({status:"registered",payload:registeredUser})
  } 
});


router.post('/addImage', upload.single('photo'), async function(req,res){
  let tagInfo = JSON.parse(req.body.tagInfo);
  console.log(req.file.filename);
  await eventController.addPhoto(tagInfo.id,req.file.filename);
  let makeLog = await eventController.registerLog(tagInfo.id,"photoupload",req.body.author,req.ip.replace('::ffff:', ''));
  res.send('asd');
});
module.exports = router;
 