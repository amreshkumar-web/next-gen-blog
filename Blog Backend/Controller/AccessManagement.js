const path= require("path");
const fs = require('fs')
const regDb= require("../RegStructure")
const adminDb = require("../AdminStructure");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../utils/SendResp.js");
const PasswordVerification = require("../utils/PasswordVerification.js");
const sessionTokenDb = require("../SessionTokenDb");



/* async function PasswordVerification(userId,password){
    console.log(userId,password)
    const isAdminFound = await adminDb.findOne({_id:userId});
    if(!isAdminFound) return false;
    console.log(isAdminFound.Password);
    const passVerify = await encrypt.compare(password,isAdminFound.Password);
    if(!passVerify) return false;
    console.log("yup")
    return true;
}
 */






const getQueueData = async (req,resp) => {
    try {
    
    const {jUserId , jAccess} =req.user;

    if(jAccess != "owner") return sendResponse(resp,403,"Access Denied");
             
    const isFound = await adminDb.exists({_id:jUserId});
    if(!isFound) return resp.status(401).json({message:"Pls login again"});

    const queueData = await regDb.find().select("Name Email Date").lean();
    return sendResponse(resp,200,"Data fetched",queueData);
    
    } catch (error) {
      /*   resp.status(500).json({message:"Something went wrong in accesManager"}); */
        return sendResponse(resp,500,"Something went wrong");
    }
}



//granting Access and put into admin table 

const grantingAccess =async (req,resp) => {
    
const {userId,AccessRole,password} = req.body;
console.log(userId,AccessRole,password)
const {jUserId,jAccess} = req.user;
const allowedRoles=["owner" , "editor" , "viewer"];
if(!allowedRoles.includes(AccessRole)) return sendResponse(resp,400,"Invalid Role");
if(jAccess !== "owner") return sendResponse(resp,403,"Only owner can give access");
if(!userId || !AccessRole) return sendResponse(resp,400,"User Id and Access role is required.");
if(AccessRole === "owner" && !password) return sendResponse(resp,400,"Password is required when granting owner access.");


try {
    if(AccessRole === "owner" && password){
            if(!(await PasswordVerification(jUserId,password))) return sendResponse(resp,400,"Wrong password");
            
    }

    
    const [isUserInAdmin,isUserInQueue] =await Promise.all([
        adminDb.exists({_id:userId}),
        regDb.exists({_id:userId})
    ])
   
    
    if(isUserInAdmin) return sendResponse(resp,400,"User is already have access");
    if(!isUserInQueue) return sendResponse(resp,400,"User is no more in queue");
   
   
  
    const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },  // Ensure _id is correct
        { $set: { Access: AccessRole } },  // Add Access field
        { 
            $merge: { 
                into: { db: "Blog", coll: "AdminData" },  // Ensure correct database
                whenMatched: "merge", 
                whenNotMatched: "insert"  
            } 
        }
    ];
    await regDb.aggregate(pipeline);

    //creating session token for this user
    console.log(userId);
    const result = await sessionTokenDb.create({
        UserId:userId,
        RefreshToken:null,
        SessionSecret:null,
        FingerPrint:null
    });
 
    if(!result || result.length ===0) return sendResponse(resp,500,"Aggregation failed, no changes made.")

    await regDb.deleteOne({_id:userId});
    return resp.status(200).json({message:`Now User is ${AccessRole}`});
} catch (error) {
    console.log("Aggregate error" + error)
    return resp.status(500).json({message:"Something went2 wrong"});
}

}




//AccessModifier

const accessModifier = async (req,resp) => {
    const {jUserId,jAccess} = req.user;
    const {userId,AccessRole,password} = req.body;
    if(!userId || !AccessRole) return resp.status(400).json({message:"User Id and Access role is required."});
    if(jAccess!=="owner") return resp.status(403).json({message:"Only owner can change Role"});
    if(AccessRole==="owner" && !password) return resp.status(400).json({message:"Password is require"});
  try {
    const isUserFound= await adminDb.findOne({_id:userId}).select("Password Access MainOwner").lean();
    if(!isUserFound) return resp.status(404).json({message:"User not found"});
    if(isUserFound.Access===AccessRole) return resp.status(400).json({message:`User is already ${AccessRole}`}); 
    console.log(isUserFound.Access);
    if(isUserFound.MainOwner) return resp.status(403).json({message:"You cannot change role of your owner"});
    if(AccessRole==="owner"){
    if(!(await PasswordVerification(jUserId,password))) return resp.status(400).json({message:"Wrong password"}); 
  }

    const updateAccess = await adminDb.updateOne(
    {_id:userId},
    {$set : {Access:AccessRole}},
    {runValidators:true}
);

if(updateAccess.modifiedCount>0) return resp.status(200).json({message:`User is now ${AccessRole}`});
return resp.status(400).json({message:`Pls try after some time`});

  } catch (error) {
    return resp.status(500).json({message:`Something went wrong in accesModifier`});
  }

}




//fetching data who have acces 

const gettingAdminData = async (req,resp) => {
    try {
    const allAdminList = await adminDb.find().select("Name Access Email").lean();
    return resp.status(200).json(allAdminList);
    } catch (error) {
     return resp.status(500).json({message:"Something went wrong"});    
    }
}





//Revoking all access
const revokingAccess = async (req,resp) => {
    const {jUserId,jAccess} = req.user;
    const {userId,password} = req.body;
    if(jAccess!=="owner") return resp.status(402).json({message:"You are not owner"});
   

    try {
        const checkUserId = await adminDb.findOne({_id:userId}).select("Access MainOwner").lean();
        if(!checkUserId) return resp.status(404).json({message:"User not found"});
        if(checkUserId.MainOwner) return resp.status(403).json({message:"You cannot revoke"});
        if(checkUserId.Access==="owner" && !password) return resp.status(402).json({message:"Password is required"});
        if(checkUserId.Access==="owner"){
            if(!(await PasswordVerification(jUserId,password))) return resp.status(400).json({message:"Incorrect Pasword"});
        }
        const revokeAccess = await adminDb.deleteOne({_id:userId});
        
        if(revokeAccess.deletedCount>0){
            await sessionTokenDb.deleteOne({UserId:userId});
            return resp.status(200).json({message:"User is removed"})
        } 
        return resp.status(400).json({message:"Pls try after some time"});
    } catch (error) {
        return resp.status(500).json({message:"Something went wrong"});
    }

}












//delete data from QueueData


const  deleteQueueData = async (req,resp) =>{

try {
   
const {jUserId , jAccess } = req.user;
const deleteUser =  req.params.id;

if(jAccess != "owner") return resp.status(403).json({message: "Access Denied"})

const isUserFound = await adminDb.findOne({_id:jUserId}).select("Access").lean();
if(!isUserFound) return resp.status(401).json({message:"Pls login again"});
if(isUserFound.Access != "owner") return resp.status(403).json({message:"You Don't have Access"})
    
const isUserInQueue = await regDb.exists({_id:deleteUser}).lean();

if(!isUserInQueue) return resp.status(400).json({message:"User is not in Queue"});

const isUserDeleted = await regDb.findOneAndDelete({_id:deleteUser}).select('ProfileImage').lean();

if(!isUserDeleted) return sendResponse(resp,500,"Something went wrong");
const profileImgPath=isUserDeleted.ProfileImage;
console.log(profileImgPath);
if(profileImgPath){
    const fullPath = path.join(__dirname,profileImgPath);
    fs.unlink(fullPath,(err)=>{
            if(err) return sendResponse(resp,500,"Something went wrong");
            else console.log('Profile Image Deleted')
    })
}

resp.status(201).json({message:"Succesfully Deleted",isUserDeleted});


} catch (error) {
    resp.status(500).json({message:"Unable to delete Pls try again"});
}

}








module.exports = { getQueueData , deleteQueueData , grantingAccess,accessModifier, gettingAdminData , revokingAccess };