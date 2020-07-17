const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const geoSchema = Schema({
    identificatorNFC: String,
    date: { type: Date, default: Date.now },
    coordinates:{
        latitude:{
            type:Number
        },
        longitude:{
            type: Number
        }
    }
}); 

const geo = mongoose.model('geolocations',geoSchema);
module.exports = geo;