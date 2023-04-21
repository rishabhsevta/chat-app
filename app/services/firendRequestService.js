'use strict';

const {friendRequestModel}  = require('./../models')
let friendRequestService = {};

/**
* function to create.
*/
friendRequestService.create = async (payload) => {
    return await new friendRequestModel(payload).save();
};

/**
* function to insert.
*/
friendRequestService.insertMany = async (payload) => {
    return await friendRequestModel.insertMany(payload);
};

/**
* function to find.
*/
friendRequestService.find = async (criteria, projection = {}) => {
    return await friendRequestModel.find(criteria, projection).populate({path:'senderId',select:'userName'}).populate({path:'receiverId',select:'userName'});
};

/**
* function to find one.
*/
friendRequestService.findOne = async (criteria, projection = {}) => {
    return await friendRequestModel.findOne(criteria, projection);
};

/**
* function to update one.
*/
friendRequestService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await friendRequestModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
friendRequestService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await friendRequestModel.updateMany(criteria, dataToUpdate, projection).lean();
};


/**
* function to update One.
*/
friendRequestService.updateOne = async (criteria, dataToUpdate, projection = {}) => {
    return await friendRequestModel.updateOne(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
friendRequestService.deleteOne = async (criteria) => {
    return await friendRequestModel.deleteOne(criteria);
};

/**
* function to delete Many.
*/
friendRequestService.deleteMany = async (criteria) => {
    return await friendRequestModel.deleteMany(criteria);
};

/**
* function to apply aggregate on UserModel.
*/
friendRequestService.aggregate = async (query) => {
    return await friendRequestModel.aggregate(query);
};

module.exports = friendRequestService;