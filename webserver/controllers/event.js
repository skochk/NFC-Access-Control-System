let userModel = require('../models/users');
let geolocationModel = require('../models/geolocations');
let logModel = require('../models/logs');

module.exports.add = async(data)=>{
    try{
        const newUser = new userModel({
            identificatorNFC: data.tagInfo.id,
            name: data.name,
        });
        let user = await newUser.save();
        return user;
    }catch(err){
        if(err) throw err;
    }
}

module.exports.isRegistered = async(data)=>{
    try{
        let res = await userModel.findOne({identificatorNFC:data.tagInfo.id});
        return res;
    }catch(err){
        if(err) throw err;
    }
}

module.exports.addPhoto = async(id, filename)=>{
    try{    
        console.log('id',id,'filename',filename);
        let res = await userModel.findOneAndUpdate({identificatorNFC: id},{photo:filename},{upsert: true});
        console.log(res);
    }catch(err){
        if(err){
            throw err;
        }
    }
}

module.exports.registerGeo = async(id,coords)=>{
    try{
        // console.log('coords in controller',coords);
        let newCoords = new geolocationModel({
            identificatorNFC:id,
            coordinates:{
                latitude:coords.latitude,
                longitude: coords.longitude
            }
        });
        let record = await newCoords.save();
        return {status:"coords ok",payload:record};
    }catch(err){
        if(err) throw err;
    }
}

module.exports.registerLog = async(id,eventType,author,ip)=>{
    try{
        let newLog = new logModel({
            identificatorNFC: id, // id of nfc tag which had manipulated
            eventType: eventType, //scan, edit, login, photopload, accessrequest
            author: author, // admin or phone device ID
            ip:ip
        });
        let log = await newLog.save();
        return log;
    }catch(err){
        if(err) throw err;
    }
}