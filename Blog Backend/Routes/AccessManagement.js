const express=require("express");
const AccessManager=express.Router();
const {getQueueData,deleteQueueData,grantingAccess,accessModifier,gettingAdminData ,revokingAccess} = require("../Controller/AccessManagement");
const AuthToken = require("../Middlewear/TokenAuth")

AccessManager.get('/RegistrationQueue',AuthToken,getQueueData);
AccessManager.get('/getAllAdminData',AuthToken,gettingAdminData);
AccessManager.delete('/DeleteRegistrationRequest/:id',AuthToken,deleteQueueData);
AccessManager.post('/requestAccept',AuthToken,grantingAccess);
AccessManager.patch('/updateUserAccess',AuthToken,accessModifier);
AccessManager.delete('/removeUser',AuthToken,revokingAccess);
module.exports = AccessManager;