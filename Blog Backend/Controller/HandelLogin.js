const encrypt = require("bcrypt");
const regDb = require("../RegStructure");
const adminDb= require("../AdminStructure");
require("dotenv").config();
const jwt=require("jsonwebtoken");
const SECRET_KEY=process.env.JWT_SECRET; 
const sessionTokenDb=require("../SessionTokenDb")
const crypto = require("crypto");
const sendResponse = require("../utils/SendResp");
const { send } = require("process");
const frestalRound=10;
const client = require("../RedisDb/redisDb.js")




async function blackList(token, expireInSec) {
    const expireAt = Math.floor(Date.now() / 1000) + expireInSec;
    const result = await client.zAdd("blackList", [{ score: expireAt, value: token }]);
    return result > 0; // ✅ Returns true if successfully added
}




const login = async (req,resp) => {
    const {username,password,fingerPrint} = req.body;
    
    try {
        const [checkExistingUserQueue,checkExistingUserAdmin] = await Promise.all([
            regDb.exists({ Email: username }).collation({ locale: "en", strength: 2 }), // ✅ `collation` MongoDB query pe lagega
            adminDb.findOne({ Email: username }).collation({ locale: "en", strength: 2 }).lean()
         ]);
         if(checkExistingUserQueue) return resp.status(400).json({message:"You are Already in Queue"});
        if(!checkExistingUserAdmin) return resp.status(400).json({message:"First register"});
        console.log(username,password,fingerPrint);
        
        const isMatch = await encrypt.compare(password,checkExistingUserAdmin.Password);
        if(!isMatch){
            return resp.status(400).json({message:"Wrong password"});
        }
        const sessionSecret = crypto.randomBytes(32).toString("hex");
       const accessToken = jwt.sign({jUserId:checkExistingUserAdmin._id,jAccess:checkExistingUserAdmin.Access,jSessionSecret:sessionSecret},SECRET_KEY,{ expiresIn: "15m" });
       
        const token = jwt.sign({jUserId:checkExistingUserAdmin._id,jAccess:checkExistingUserAdmin.Access},SECRET_KEY,{ expiresIn: "240h" });
        const hashedToken = await encrypt.hash(token,frestalRound);

        client.zAdd

        const insertDbToken = await sessionTokenDb.updateOne({UserId:checkExistingUserAdmin._id}, {
            RefreshToken:hashedToken,
            SessionSecret:sessionSecret,
            FingerPrint:fingerPrint
        },
        {upsert:true}, // Creates a new document if not found
    
    )
    if (insertDbToken.modifiedCount === 0 && insertDbToken.upsertedCount === 0) {
        return resp.status(500).json({ message: "Failed to store session token. Please try again." });
    }
console.log("authToken",token)
        resp.cookie("authToken",token,{
            httpOnly:true,
            secure:false, // Only works on HTTPS (set `false` for localhost)
            sameSite:"Lax",
            maxAge:new Date(Date.now() + 240 * 60*60*1000),
        })

        resp.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:false, // Only works on HTTPS (set `false` for localhost)
            sameSite:"Lax",
            maxAge:new Date(Date.now() + 15 * 60 * 1000) , 
        })

        resp.cookie("fingerPrint",fingerPrint,{
            httpOnly:true,
            secure:false, // Only works on HTTPS (set `false` for localhost)
            sameSite:"Lax",
            maxAge:new Date(Date.now() + 240 * 60*60*1000),
        })

        const {Password,...ProfileDetails} = checkExistingUserAdmin;
       
        return resp.status(200).json({message:"Login Successful",accessToken:`${accessToken}`,ProfileDetails});

    } catch (error) {
        console.log("==========> error in login controller",error);
  return resp.status(500).json({message:"Something Went Wrong"});
    }
}









const register = async (req,resp) => {  
const {name , username ,password }=req.body;

try{
    //checking user is already exist or not
 const [checkExistingUserQueue,checkExistingUserAdmin] = await Promise.all([
    regDb.exists({ Email: username }).collation({ locale: "en", strength: 2 }),
    adminDb.exists({ Email: username }).collation({ locale: "en", strength: 2 })
 ]);
 

 if(checkExistingUserAdmin) return resp.status(400).json({message:"You are Already in by Owner"});
 if(checkExistingUserQueue) return resp.status(400).json({message:"You are Already in Queue"});
 
  
  //hashingPassword and put into DataBase
const hashPassword= await encrypt.hash(password,10);

const imagePath = req.file ? `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`:null;
const putData = await regDb.create({
    Name:name,
    Email:username,
    Password:hashPassword,
    ProfileImage:imagePath
})

return resp.status(201).json({message:"User is added to queue waiting for Admin to give access"});

}catch(e){
console.log("==========> error in register controller");
return resp.status(500).json({message:"Something Went Wrong"});
}
}










//token varification


const tokenVarificationRespond = (req,resp) =>{
    console.log("working");
    return resp.status(200).json({message:"Welcome Back!"});
}


//handel logout

const handelLogOut = async (req,resp) =>{
    console.log("hited")
    try {
        const accessToken = req.cookies?.accessToken;
    if(!accessToken) return sendResponse(resp,400,"Token is Missing");
    const isBlacklisted = await blackList(accessToken, 900);
   
    if (!isBlacklisted) return sendResponse(resp, 500, "Failed to blacklist token");
   clearCookies(resp);
    return sendResponse(resp, 200, "Successfully Logged Out");
    } catch (error) {
        console.error("handleLogOut Error:", error);
        return sendResponse(resp, 500, "Something went wrong");
    }
}






//helper function

const logout = async (userId) => {
    console.log("logoutuser")
    try {
        const logoutUser = await sessionTokenDb.updateOne({UserId:userId},{
            $set:{SessionSecret:null,RefreshToken:null,FingerPrint:null}
        })
       
        
        if(logoutUser.modifiedCount===0 && logoutUser.upsertedCount===0){
            return false;
        }
        return true;

    } catch (error) {
        console.log("helper function error Handel Login" , error)
        return false;
    }
}


//clear cookies function


const clearCookies = (resp) => {
    resp.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    });
    resp.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    });
    resp.clearCookie("fingerPrint", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    });
};









// token refresh

const tokenRefresh = async (req,resp) =>{
const refreshToken = req.cookies?.authToken;

const userFingerprint = req.cookies?.fingerPrint;

if(!refreshToken) return sendResponse(resp,401,"Unauthorized, token missing!");
if(!userFingerprint) return sendResponse(resp,400,"Pls Login Again");

let jwtUserId=null;
try {
    
    const decoded = jwt.verify(refreshToken, SECRET_KEY);
    
        const { jUserId, jAccess } = decoded;
        jwtUserId = jUserId;
     const findSessionData= await sessionTokenDb.findOne({UserId:jUserId}).lean();
    
     if(!findSessionData) return sendResponse(resp,400,"Pls login again");
     if(userFingerprint!==findSessionData.FingerPrint){
       
       if(!await logout(jUserId)) return sendResponse(resp,500,"Pls login Again") 
        return sendResponse(resp,400,"Invalid FingerPrint");
    }
     if(!findSessionData.RefreshToken){ 
        return sendResponse(resp,400,"Pls Login again");
     }
  const match=await encrypt.compare(refreshToken,findSessionData.RefreshToken);
  if(!match) return sendResponse(resp,400,"Hahs Value not matched");
  const sessionSecret = crypto.randomBytes(32).toString("hex");
  const accessToken = jwt.sign({jUserId:jUserId,jAccess:jAccess,jSessionSecret:sessionSecret},SECRET_KEY,{ expiresIn: "15m" });
  const token = jwt.sign({jUserId:jUserId,jAccess:jAccess},SECRET_KEY,{ expiresIn: "240h" });
  const hashedToken = await encrypt.hash(token,frestalRound);
 
  const updateSessionData = await sessionTokenDb.updateOne({UserId:jUserId},{
    $set:{RefreshToken:hashedToken,SessionSecret:sessionSecret},
  })

  if(updateSessionData.modifiedCount===0 && updateSessionData.upsertedCount===0){
return sendResponse(resp,500,"Something went wrong");
  }
    resp.cookie("authToken",token,{
        httpOnly:true,
        secure:false, // Only works on HTTPS (set `false` for localhost)
        sameSite:"Lax",
        maxAge:new Date(Date.now() + 240 * 60*60*1000),
    })
    resp.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false, // Only works on HTTPS (set `false` for localhost)
        sameSite:"Lax",
        maxAge:new Date(Date.now() + 240 * 60*60*1000),
    })
    return resp.status(200).json({message:"Token verified"});

} catch (error) {
   clearCookies(resp);
    console.log("tokenrefresh error" , error);
console.log(error.jwtUserId,"jwt name")
    if (error.name === "TokenExpiredError") {
        if(!await logout(jwtUserId)){
            console.log("Logout failed during token refresh"); 
            return sendResponse(resp,500,"Something Went Wrong")
        }
        return sendResponse(resp, 401, "Session Expired");
    }



// Extract user ID from error if available
if (error.jwtUserId) {
    jwtUserId = error.jwtUserId;
}
if(!jwtUserId) return sendResponse(resp,500,"Email andd password is required")
console.log("clear cookies")
if(jwtUserId){

    //clear cookies usinf function
     clearCookies(resp);


    if(!await logout(jwtUserId)){
        console.log("Logout failed during token refresh"); 
        return sendResponse(resp,500,"Something Went Wrong")
    }
}

    return sendResponse(resp,500,"Session Expire");
}
}





module.exports ={login,register,tokenVarificationRespond,tokenRefresh,handelLogOut};