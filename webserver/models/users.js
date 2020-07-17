const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = Schema({
    identificatorNFC: String,
    name: String,
    photo: String,
    permission: String, //admin, worker, none
}); 

const users = mongoose.model('users',userSchema);
module.exports = users; 