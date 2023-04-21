'use strict';

let dbService = {};
const model = require('../models/userModel')
/**
* function to create.
*/
dbService.create = async (payload) => {
    return await new model(payload).save();
};

/**
* function to insert.
*/
dbService.insertMany = async (payload) => {
    return await model.insertMany(payload);
};

/**
* function to find.
*/
dbService.find = async (criteria, projection = {}) => {
    return await model.find(criteria, projection).lean();
};

/**
* function to find one.
*/
dbService.findOne = async (criteria, projection = {}) => {
    return await model.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
dbService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await model.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
dbService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await model.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
dbService.deleteOne = async (criteria) => {
    return await model.deleteOne(criteria);
};

/**
* function to delete Many.
*/
dbService.deleteMany = async (criteria) => {
    return await model.deleteMany(criteria);
};

/**
* function to apply aggregate on model.
*/
dbService.aggregate = async (query) => {
    return await model.aggregate(query);
};

module.exports = dbService;