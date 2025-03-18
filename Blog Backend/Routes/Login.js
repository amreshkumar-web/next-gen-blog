const express=require("express");
const loginRoutes=express.Router();
const {login,register,tokenVarificationRespond,tokenRefresh, handelLogOut} = require("../Controller/HandelLogin");
const {uploadSingle} = require("../Middlewear/uploadImage");
const AuthToken = require("../Middlewear/TokenAuth")

loginRoutes.post('/login',login);
loginRoutes.post('/register',uploadSingle,register);
loginRoutes.get('/tokenValidate',AuthToken,tokenVarificationRespond)
loginRoutes.post('/tokenRefresh',tokenRefresh)
loginRoutes.post('/loggedOut',handelLogOut)

module.exports = loginRoutes;