const adminDb = require("../AdminStructure");
const encrypt = require("bcrypt");

const PasswordVerification = async (userId,password) => {
  console.log("Password verification ...")
    const isAdminFound = await adminDb.findOne({_id:userId});
    if(!isAdminFound) return false;
    const passVerify = await encrypt.compare(password,isAdminFound.Password);
    if(!passVerify) return false;
    return true;
}

module.exports =PasswordVerification;