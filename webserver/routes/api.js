let express = require('express');
let router = express.Router();
let logsModel = require('./../models/logs');
let geoModel = require('./../models/geolocations');
let tagsModel = require('./../models/users');
var multer  = require('multer');
const path = require('path');
const eventContoller = require('./../controllers/event');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage: storage });



router.get('/logs', async function(req,res){
    try{
        let data = await logsModel.find({});
        res.send(data); 
    }catch(err) {
        throw err
    };
});

router.get('/coordinates',async function(req,res){
    try{
        let data = await geoModel.find({});
        res.send(data);
    }catch(err){
        throw err;
    }
});

router.get('/tags',async function(req,res){
    try{
        let data = await tagsModel.find({});
        res.send(data);
    }catch(err){
        throw err;
    }
});

router.get('/stats/scancount',async function(req,res){
    try{
        let data = await logsModel.countDocuments({eventType:"scan"});
        // console.log(data);
        res.send({count:data});
    }catch(err){
        throw err;
    }
});

router.get('/stats/mostpopulartag',async function(req,res){
    try{
        let data = await logsModel.aggregate([
            {$match:{"eventType":"scan"}},
            {$sortByCount: "$identificatorNFC"}
            ]);
        // console.log(data);
        res.send({count:data});
    }catch(err){
        throw err;
    }
});
router.get('/stats/lastscannedtag',async function(req,res){
    try{
        let data = await logsModel.findOne({eventType:"scan"}).sort({ _id: -1 }).limit(1);
        let getName = await tagsModel.findOne({identificatorNFC:data.identificatorNFC});
        console.log({name:getName.name,identificatorNFC:data.identificatorNFC,date:data.date});
        res.send({name:getName.name,identificatorNFC:data.identificatorNFC,date:data.date});
    }catch(err){
        throw err;
    }
})
 
router.post('/updatetag', upload.single('photo'), async function(req,res){
    // console.log(req.file.filename);
    // console.log(req.body); 
    let {identificatorNFC,permission} = req.body
    let changing;
    try{
        if(req.file && req.file.filename && req.body.permission){
            changing = await tagsModel.findOneAndUpdate({identificatorNFC: identificatorNFC},{photo:req.file.filename,permission:permission},{upsert: true});
        }else if(req.file && req.file.filename){
            changing = await tagsModel.findOneAndUpdate({identificatorNFC: identificatorNFC},{photo:req.file.filename},{upsert: true});
        }else if(req.body.permission){
            changing = await tagsModel.findOneAndUpdate({identificatorNFC: identificatorNFC},{permission:permission},{upsert: true});
        }
        let regLog = await eventContoller.registerLog(identificatorNFC,"edit",'admin',req.ip.replace('::ffff:', ''))
        console.log(changing);
        res.send('ok');
    }catch(err){
        throw err;
    }
})

module.exports = router; 