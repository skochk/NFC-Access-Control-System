const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const logSchema = Schema({
    identificatorNFC: String, // id of nfc tag which had manipulated
    eventType: String, //scan, edit, photoupload, registertag
    date: { type: Date, default: Date.now },
    author: String, // name of device or admin etc
    ip: String
}); 

const logs = mongoose.model('logs',logSchema);
module.exports = logs;