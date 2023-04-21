const {decryptJwt} = require('../utils/utils');
const services = require('../services');
const socketController = require('../controllers/socketController');
const mongoose = require('mongoose');
const socket ={};
const socketData = [];

const findUser = async (id) => {
    let query = [
        {
          $lookup: {
            from: "users_collections",
            localField: "senderId",
            foreignField: "_id",
            as: "sender"
          }
        },{
          $lookup: {
            from: "user_collections",
            localField: "receiverId",
            foreignField: "_id",
            as: "receiver"
          }
        },
        {$match: {$or: [{"sender._id": payload.user._id}, {"receiver._id": payload.user._id}]}},
        {$addFields: {userName: 
          {$cond: {if: {$eq: ["sender._id", payload.user._id]}, then: "$sender", else: "$receiver"}}
        }},
        {$unwind: "$userName"},
         {$replaceRoot: {newRoot: "$userName"}},
         {$project:{userName:1,_id:0}}
      ];
      let friends = await services.friendRequestService.aggregate(query);
      friends =Object.values(...friends);
      console.log(friends);
}





// const checkAuth =(socket,next)=>{
//     const token = socket.handshake.auth?.token;
//     try{
//         decryptJwt(token);
//         next();
//     }   
//     catch(err){ 
//         console.log(err);
//     }
// }


socket.connect = async (io) =>{
    io.on('connection', async (socket)=>{
        const token = socket.handshake.auth?.token;
        let user = await socketController.findUser(token);
        socket.id = user._id.toString();
        
        socket.on("send-message", async (payload)=>{
            console.log(payload);
            await socketController.message({...payload, senderId: socket.id});
        })


        socketController.findUser(token).then((data)=>{
            socket.emit('userName',data.userName);
        })
        // socketData.push({socketId:socket.id,userId:id}); 
        // socket.on('showUsers',(data)=>{
        //     findUser(id).then((user)=>{
        //         socket.emit('user_details',user);
        //     })
        // })

        // socket.on('sendDetails',(data)=>{
        //     const friend = socketData.find((val)=>{
        //         return data.id==val.userId;
        //     })
        //     currentUserName(id).then((val)=>{
        //         socket.to(friend?.socketId).emit('message',{message:data.message,sender:val});
        //     })
        //  })      
        // socket.on('disconnect',(val)=>{
        //    socketData.forEach((ele,index)=>{
        //     if(ele.socketId == socket.id){
        //         socketData.splice(index,1);
        //     }
        //    }) 
        // })
    })
}

module.exports = socket;