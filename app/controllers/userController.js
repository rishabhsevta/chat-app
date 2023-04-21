"use strict";

const path = require("path");
const CONFIG = require("../../config");
const { createErrorResponse, createSuccessResponse } = require("../helpers");
const mongoose = require("mongoose");
const {
  MESSAGES,
  ERROR_TYPES,
  NORMAL_PROJECTION,
  LOGIN_TYPES,
  EMAIL_TYPES,
  TOKEN_TYPES,
  USER_TYPE,
  OTP_EXPIRY_TIME,
  DEFAULT_PROFILE_IMAGE,
  FILE_UPLOAD_TYPE,
  USER_ACTIVITY_STATUS,
  TRAIL_KEYS,
  OTP_TYPE,
  ISVERIFIED,
  DEVICE_TYPES,
  DEEP_LINK_CUSTOM_SCHEME,
} = require("../utils/constants");
const {
  userService,
  sessionService,
  fileUploadService,
  trailService,
  friendRequestService
 } = require("../services");
const {
  compareHash,
  encryptJwt,
  sendEmail,
  generateOTP,
  addMinutesToDate,
  hashPassword,
  log,
} = require("../utils/utils");
const userModel = require("../models/userModel");

/**************************************************
 ***************** user controller ***************
 **************************************************/
let userController = {};

/**
 * function to get server response.
 * @param {*} payload
 * @returns
 */
userController.getServerResponse = async (payload) => {
  return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
};

/**
 * function to check user auth.
 * @param {*} payload
 * @returns
 */
userController.checkUserAuth = async (payload) => {
  return createSuccessResponse(MESSAGES.AUTH_IS_WORKING_FINE);
};

/**
 * function to test email service.
 * @param {*} payload
 * @returns
 */
userController.testEmail = async (payload) => {
  await sendEmail(
    {
      email: payload.email,
    },
    EMAIL_TYPES.WELCOME_EMAIL
  );
  return createSuccessResponse(MESSAGES.EMAIL_IS_WORKING_FINE);
};

/**
 * function to signUp a user.
 * @param {*} payload
 * @returns
 */
userController.signupUser = async(payload) => {
  let existUser = await userService.findOne({userName:payload.userName});
  if(existUser){
    return createErrorResponse(MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  payload.password=hashPassword(payload.password);
  const data = await userService.create(payload);
  let token = encryptJwt({id:data._id});
  await sessionService.createSession({token,tokenType:1,userId:data._id});
  return createSuccessResponse(MESSAGES.SUCCESS,{token});
}

/**
 * function to login a user.
 * @param {*} payload
 * @returns
 */
userController.loginUser = async (payload) => {
  let user = await userService.findOne({userName:payload.userName});
  if(user && compareHash(payload.password,user.password))
  {
    let token = encryptJwt({id:user._id});
    await sessionService.createSession({token,tokenType:1,userId:user._id});
    return createSuccessResponse(MESSAGES.SUCCESS,{token});
  }
  return createErrorResponse(MESSAGES.INVALID_CREDENTIALS,ERROR_TYPES.FORBIDDEN);
};

/**
 * function to forget.
 * @param {*} payload
 * @returns
 */
userController.forget = async (payload) => {
  const user = await userService.findOne({email:payload.email});
  if(user){
    let token = encryptJwt({id:user._id});
    await sessionService.createSession({token,tokenType:TOKEN_TYPES.RESET_PASSWORD, userId: user._id});
    await sendEmail({email:'rishabhsevta@gmail.com',token},EMAIL_TYPES.RESET_PASSWORD_EMAIL);
    return createSuccessResponse(MESSAGES.SUCCESS);
  }
  else{
    return createErrorResponse(MESSAGES.INVALID_CREDENTIALS,ERROR_TYPES.FORBIDDEN);
  }
};



/**
 * function to reset.
 * @param {*} payload
 * @returns
 */
userController.reset = async (payload) => {
  let user = await sessionService.removeSession({token:payload.token,tokenType:TOKEN_TYPES.RESET_PASSWORD});
  if(user){
    let newPassword = hashPassword(payload.password);
    await userService.updateOne({_id:user.userId._id},{password:newPassword});
    return createSuccessResponse(MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY);
  }
  else{
    return createErrorResponse(MESSAGES.UNAUTHORIZED,ERROR_TYPES.UNAUTHORIZED);
  }
};

/**
 * function to update user profile.
 * @param {*} payload
 * @returns
 */
userController.updateProfile = async (payload) => {
  if(Object.values(payload.file).length){
    let filePath = await fileUploadService.uploadFileToLocal(payload);
    payload.profilePic=filePath;
  }
    await userService.findOneAndUpdate({_id:payload.user._id},{$set:payload});
  return createSuccessResponse(MESSAGES.SUCCESS);
}

/**
 * function to show all friend users.
 * @param {*} payload
 * @returns
 */
userController.showUsers = async (payload) => {
  let findFriendRequests = await friendRequestService.find({receiverId:payload.user._id,status:{$in:[0,1]}});
  let friendRequests = findFriendRequests.map((val)=>{
    return val.senderId.userName;
  });

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
  let friends = await friendRequestService.aggregate(query);
  friends =Object.values(...friends);

  let totalUsers = await userService.find({userName:{$nin:[payload.user.userName,...friendRequests]}},{userName:1,_id:0});
  return createSuccessResponse(MESSAGES.SUCCESS,{totalUsers,friendRequests,friends});
};

/**
 * function to send Request.
 * @param {*} payload
 * @returns
 */
userController.sendRequest = async (payload) => {
  const user = await userModel.findOne({userName:payload.userName});
  if(!user){
    return createErrorResponse(MESSAGES.NO_USER_FOUND,ERROR_TYPES.DATA_NOT_FOUND);
  }
  else{
    const data = {
      senderId:payload.user._id,
      receiverId:user._id,
    }
      const sentRequests = await friendRequestService.findOne({$and:[{$or:[{senderId:data.senderId},{receiverId:data.senderId}]},{$or:[{senderId:data.receiverId},{receiverId:data.receiverId}]}]});
      if(!sentRequests){
        await friendRequestService.create(data);
        return createSuccessResponse(MESSAGES.SUCCESS);
      }
      else if(sentRequests.status==-1){
        await friendRequestService.updateOne({_id:sentRequests._id},{status:0});
        return createSuccessResponse(MESSAGES.SUCCESS);
      }
      else{
        return createErrorResponse(MESSAGES.REQUEST_ALREADY_SENT,ERROR_TYPES.BAD_REQUEST); 
      }   
  }
}

/**
 * function to accept Requests.
 * @param {*} payload
 * @returns
 */
userController.acceptRequests = async (payload) => {
    const senderId = await userService.findOne({userName:payload.userName},{_id:1});
    await friendRequestService.updateOne({senderId,receiverId:payload.user._id},{status:1});
    return createSuccessResponse(MESSAGES.SUCCESS);

}

module.exports = userController;
