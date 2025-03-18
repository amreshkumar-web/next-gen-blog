import React, { useState,useRef,useEffect } from "react";
import '../Css/Login.css';

import { toast } from "react-toastify";
import api from "../utils/ApiHandel"
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useAuth } from "./AuthToken";
import getFingerprint from "../utils/FingerPrintGenerator";

import { useDispatch } from "react-redux";
import { setUser } from "../GlobalData/slices/userSlice";
import handleFileChange from "../ImageHandel/imageHandeler";
export default function Login(){
    
const dispatch=useDispatch();








const [selectedContainer,setselectedContainer] = useState("login");
const [uploadedImg , setUploadedImg]=useState(null);
const [compressedImage , setCompressedImage] = useState(null);
const [fieldClear,setFieldClear]= useState(0);
const [isLoading,setIsLaoding] = useState(true);
const {AccesToken,setAccessToken} = useAuth();
const navigate = useNavigate();

//form data collection
const [name,setName] = useState(null);
const [email, setEmail] = useState(null);
const [password, setPassword] = useState(null);
const [confirmPassword, setConfirmPassword] = useState(null);


useEffect(()=>{
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
},[selectedContainer,fieldClear])


//form data collection end
const fileInputRef=useRef(null);








//handel image upload

const handelUploadClick = () =>{
    fileInputRef.current.click();
}

const handelFuctionTrigger= async (e) =>{
 const imageUploadProcess = await handleFileChange({e,setCompressedImage,setUploadedImg});
if(imageUploadProcess){
  toast.success("🎉 Image Uploaded Successfully!", {
    icon: "✅",
    className: "custom-toast",
  });
  return;
}
else{
  toast.error("Error during Upload");
}
}




//handel image upload part end








//email and password validator

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };






 //generating FingerPrint













//form data handel

const submitData =async (e) =>{
    e.preventDefault();
    
 if(!validateEmail(email)) return toast.error("Pls enter valid email") ;
 if(!validatePassword(password)) return toast.error("Password must be contains at least 1 uppercase ,1 lowercase,1 symbol , 1 number, And password should be legth 6") ;
 

    const formData = new FormData();
    const fingerprint=await getFingerprint();
    if(selectedContainer === "login"){
localStorage.setItem("imageOptamizer",fingerprint);
formData.append("username",email);
formData.append("password",password);
formData.append("fingerPrint",fingerprint) 
hitLoginApi("/user/login",formData);
       
    }
  else{
    formData.append("name",name);
    formData.append("username",email);
    formData.append("password",password)
    if(compressedImage){
        formData.append("image",compressedImage);
        hitRegistrationApi("/user/register" ,formData,true)
    } 
    else{hitRegistrationApi("/user/register" ,formData,false)};

   
  }

}



useEffect(() => {
    const validateToken = async () => {
        console.log("start")
      try {
        const response = await api.get("/user/tokenValidate")
  
        if (response.status >= 200 && response.status < 300) {

          toast.success("Welcome Back!");
          navigate("/");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setIsLaoding(false);
        console.log("Validation Error", error);
      }
    };
  
    validateToken(); // Call the async function inside useEffect
  }, []); // Dependency array remains empty
  



 


 



//login Api

const hitLoginApi = async (url,data) =>{

try {
    
    const response = await api.post(url,data ,{
        headers:{
            "Content-Type": "application/json",
        },
    });

    if(response.status >= 200 && response.status<300) {
        toast.success("🎉 Log in Successfully!", {
            icon: "✅",
            className: "custom-toast",
          });  
          /* dispatch(setUser(response.data.ProfileDetails)); */
          const {Access,Name,ProfileImage,_id} =response.data.ProfileDetails;
          dispatch(setUser(
            {
              access:Access,
              myId:_id,
              name:Name,
              profileimage:!ProfileImage?"":ProfileImage
            }
          ))
     console.log(_id,"Profile",ProfileImage)
          navigate("/");

    }
    else{
        toast.error(response.data.message);
        console.log(response.data)
    }


} catch (error) {
   if(error.response){
    toast.warn(error.response.data.message)
   }
   else{
    toast.warn("Something Went Wrong");
    console.error( "Request Failed" , error);
   }
}

}




//registration Api


const hitRegistrationApi = async (url,data,isFormData) =>{

    try {
        const response = await api.post(url,data,{
            headers:{
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
            }
        })
    
        if(response.status >= 200 && response.status<300) {
            toast.success("🎉 Log in Successfully!", {
                icon: "✅",
                className: "custom-toast",
              });  
              console.log(response.data);
              setFieldClear(fieldClear + 1);
        }
        else{
            toast.error(response.data.message);
            console.log(response.data)
        }
    } catch (error) {
        if(error.response){
            toast.warn(error.response.data.message)
            console.log(error.response.data.message)
           }
           else{
            toast.warn("Something Went Wrong");
            console.error( "Request Failed" , error);
           }
    }

}





return(
    isLoading ? <Loading /> :
    <>
    <div className="loginParent">
      <div className="loginWholeContent">
    <div style={(selectedContainer==="singUp")?{borderColor:"#19CC8B"}:{}} className="loginProfileBlock">
    <div className="face" style={(selectedContainer==="singUp")?{top:"180%"}:{}}></div>
    <div className="faceBody" style={(selectedContainer==="singUp")?{top:"200%"}:{}}></div>
    
    
    <input ref={fileInputRef} accept="image/*" onChange={handelFuctionTrigger} style={{display:"none"}} type="file"></input>

    <div className="addPhoto" style={(selectedContainer==="login")?{top:"200%"}:{}} onClick={handelUploadClick}>
        {
            compressedImage?<><img src={uploadedImg} alt="profileImage" /></>:<><span>+</span></>
        }
        
        </div>    
        
        
    </div> 
    <div className="loginChild">
    <div className="loginSingupContainer">


     <button onClick={() => {setselectedContainer("login")}} style={(selectedContainer==="login")?{color:"white"}:{color:"rgb(151, 151, 151)"}}   aria-label="Login Button" id="loginBtn" data-test="login-button">Login</button>


     <button onClick={() => {setselectedContainer("singUp")}} style={(selectedContainer==="singUp")?{color:"white"}:{color:"rgb(151, 151, 151)"}}   aria-label="Signup Button" id="singUpBtn" data-test="signup-button">SingUp</button>


     <div className="currentButtonIdentifier">
        <div style={(selectedContainer==="login")?{left:0}:{left:"50%"}} className="detecterMover"></div>


     </div>
    </div>

    <div className="loginFormField">
        <div style={(selectedContainer==="login")?{height:0}:{}} className="formTextField">
            <span>Name</span>
            <input value={name} onChange={(e)=>{setName(e.target.value)}} className="loginInputField" type="text" id="Name"/>
            </div>


      <div className="formTextField">
        <span>Email</span>
        <input value={email}  onChange={(e)=>{setEmail(e.target.value)}}  className="loginInputField" type="email" id="Email"/>
        </div>


      <div className="formTextField">
        <span>Password</span>
        <input value={password}  onChange={(e)=>{setPassword(e.target.value)}}  className="loginInputField" type="password" id="password" />
        </div>


      <div style={(selectedContainer==="login")?{height:0}:{}} className="formTextField">
        <span>Confirm Password</span>
        <input value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}  className="loginInputField" type="password" id="confirmPassword" />
        </div>

    </div>



    <div className="SubmitBtn">
        <button onClick={submitData} className="loginSubmitBtn" id="loginSubmitBtn" data-test="login-submit" type="submit">Submit</button>
        <span>Forget Password</span>
    </div>

    </div>




      </div>

    

    </div>
    </>
    
)



}