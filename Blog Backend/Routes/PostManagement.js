const express = require("express");
const postRoutes = express.Router();
const  AuthToken = require("../Middlewear/TokenAuth")
const {postBlogData, fetchingBlogsForAdmin}=require("../Controller/PostManagement");

postRoutes.post('/PostblogData',AuthToken,postBlogData);
postRoutes.get('/AllBlogs',AuthToken,fetchingBlogsForAdmin);
module.exports=postRoutes;