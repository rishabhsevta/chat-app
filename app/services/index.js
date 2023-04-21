'use strict';

/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
let obj = {
    dbService: require('./userService'),
    swaggerService: require('./swaggerService'),
    authService: require('./authService'),
    sessionService: require('./sessionService'),
    fileUploadService: require('./fileUploadService'),
    userService: require('./userService'),
    friendRequestService: require('./firendRequestService'),
    chatService:require('./chatServices')
 };

 module.exports = obj;