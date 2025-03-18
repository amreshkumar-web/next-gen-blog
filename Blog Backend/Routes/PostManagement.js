const express = require("express");
const postRoutes = express.Router();
const  AuthToken = require("../Middlewear/TokenAuth")
const postBlogData=require("../Controller/PostManagement");

postRoutes.post('/PostblogData',AuthToken,postBlogData);
module.exports=postRoutes;