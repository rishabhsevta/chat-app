const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

const friendRequestSchema = new Schema({
    senderId:{type:MONGOOSE.Types.ObjectId,ref:'user_collection'},
    receiverId:{type:MONGOOSE.Types.ObjectId,ref:'user_collection'},
    status:{type:Number,enum:[0,1,-1],default:0}
},{ timestamps: true, versionKey: false })

module.exports = MONGOOSE.model('friendRequest',friendRequestSchema);