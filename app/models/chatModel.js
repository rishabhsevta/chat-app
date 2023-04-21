const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

const schema = new Schema({
    senderId:{type:MONGOOSE.Types.ObjectId,ref:'user_collection'},
    receiverId:{type:MONGOOSE.Types.ObjectId,ref:'user_collection'},
    message:String,
},{ timestamps: true, versionKey: false })

module.exports = MONGOOSE.model('chat',schema);