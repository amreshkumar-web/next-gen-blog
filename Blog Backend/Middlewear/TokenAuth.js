require("dotenv").config();
const jwt=require("jsonwebtoken");
const sendResponse = require("../utils/SendResp");
const SECRET_KEY=process.env.JWT_SECRET; 
const client = require("../RedisDb/redisDb.js")


async function isTokenBlackListed(token) {
    const currentTime = Math.floor((Date.now()/1000));
    const score=await client.zScore('blackList',token);
    return score && score > currentTime;
}

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



const AuthToken = async (req,resp,next) =>{
const token =req.cookies?.accessToken;

if(!token){
    return resp.status(401).send({message:"Authentication required. Please log in."});
}
try{
    
    if( await isTokenBlackListed(token)){
        clearCookies(resp); 
        console("blacklisted")
        return sendResponse(resp,440,"User is Logged out");
    }
    
    jwt.verify(token,SECRET_KEY , (err,decode)=>{
       if(err) return sendResponse(resp,401,"Token Expire")
      req.user=decode;
    
      next();
    })
}
catch{
    resp.status(401).json({message:"Error in Middlewear auth"});
}

}

module.exports = AuthToken;