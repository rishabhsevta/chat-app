'use strict';

const { Joi } = require('../../utils/joiUtils');
const CONSTANTS = require('../../utils/constants');
const { userController } = require('../../controllers');

module.exports = [
	{
		method: 'GET',
		path: '/v1/serverStatus',
		joiSchemaForSwagger: {
			group: 'TEST',
			description: 'Route to check server is working fine or not?',
			model: 'SERVER'
		},
		handler: userController.checkServer
	},
	{
		method: 'GET',
		path: '/v1/user/auth',
		joiSchemaForSwagger: {
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			group: 'TEST',
			description: 'Route to user auth example',
			model: 'USER_AUTH'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.checkUserAuth
	}, 
	{
		method: 'POST',
		path: '/v1/testEmail',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().case('lower').email().optional().description("user's email"),
			},
			group: 'TEST',
			description: 'Route to test email',
			model: 'TEST_EMAIL'
		},
		handler: userController.testEmail
	},
	{
		method: 'POST',  
		path: '/v1/signup',
		joiSchemaForSwagger: {
			body: {
				firstName:Joi.string().required().description("user's First name"),
				lastName:Joi.string().description("user's Last name"),
				email: Joi.string().case('lower').email().optional().description("user's email"),
				userName: Joi.string().required().description("user's username"),
				password: Joi.string().required().description('User\'s password'),
			},
			group: 'SIGNUP',
			description: 'Route to login a user',
			model: 'signup'
		},
		handler: userController.signupUser
	},
    {
		method: 'POST',
		path: '/v1/login',
		joiSchemaForSwagger: {
			body: {
				userName: Joi.string().required().description("user's username"),
				password: Joi.string().required().description('User\'s password')
			},
			group: 'LOGIN',
			description: 'Route to login a user',
			model: 'Login'
		},
		handler: userController.loginUser
	},

	{
		method: 'POST',
		path: '/v1/forget',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().case('lower').email().optional().description("user's email"),
			},
			group: 'Forget',
			description: 'Route to forget a password',
			model: 'Forget'
		},
		handler: userController.forget
	},

	{
		method: 'PUT',
		path: '/v1/reset',
		joiSchemaForSwagger: {
			body: {
				password: Joi.string().required().description('New password'),
				token: Joi.string().required().description("User's JWT token.")
			},
			group: 'Reset',
			description: 'Route to reset a password',
			model: 'Reset'
		},
		handler: userController.reset
	},


	{
		method: 'PUT',
		path: '/v1/update',
		joiSchemaForSwagger: {
			formData: {
				file: Joi.file({name: "profilePic"}),
				body: {
					firstName:Joi.string().description("user's First name"),
					lastName:Joi.string().description("user's Last name"),
				},
			},
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			group: 'UPDATE',
			description: 'Route to update user Profile',
			model: 'Update'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.updateProfile
	},
	{
		method:"GET",
		path:'/v1/showUsers',
		joiSchemaForSwagger:{
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			group:'SHOW USERS',
			description:'Route to show all Registered Users and FreindRequests'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.showUsers
	},

	{
		method:"POST",
		path:'/v1/sendRequest',
		joiSchemaForSwagger:{
			body:{
				userName:Joi.string().required().description("User's Username")
			},
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			group:'SEND REQUEST',
			description:'Route to Send Friend Request'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.sendRequest
	},


	{
		method:"POST",
		path:'/v1/acceptRequest',
		joiSchemaForSwagger:{
			body:{
				userName:Joi.string().required().description("User's Username")
			},
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			group:'ACCEPT REQUEST',
			description:'Route to Accept Requests'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.acceptRequests
	},
	
];