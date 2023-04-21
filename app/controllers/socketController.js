let socketController = {};
const {decryptJwt} = require('../utils/utils');
let services = require('../services')

socketController.currentUserName = async(id) =>{
    let {userName} = await services.userService.findOne({_id:id},{userName:1,_id:0});
    return userName;
}


socketController.findUser = async (token) =>{
    let {id}= decryptJwt(token);
    let userName =await services.userService.findOne({_id:id});
    return userName;
}

socketController.message = async (payload) => {
    await services.chatService.create(payload);
}



module.exports = socketController;