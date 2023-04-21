'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { USER_TYPE } = require("../utils/constants");
const {PROFILE_DEFAULT_IMAGE} = require('../utils/constants');


/************* User Model ***********/
const userSchema = new Schema({
       
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String ,unique:true},
    password: { type:String},
    profilePic: {type:String,default:PROFILE_DEFAULT_IMAGE},
    email: { type: String},

    // dob: { type: Date },
    // city: { type: String },
    // mobile: { type: String },
    // country: { type: String },
    // postalCode: { type: String },
    // streetAddress: { type: String },
    // userType: { type: Number, enum: Object.values(USER_TYPE), default: USER_TYPE.USER },
    // isDeleted: { type: Boolean },
}, {collation: "user_collection"});

module.exports = MONGOOSE.model('user_collection', userSchema);                                         