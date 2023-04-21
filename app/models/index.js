'use strict';

/********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    DBVersionModel: require('./dbVersionModel'),
    sessionModel: require('./sessionModel'),
    userModel: require('./userModel'),
    friendRequestModel: require('./friendRequestModel'),
    chatModel:require('./chatModel')
 };