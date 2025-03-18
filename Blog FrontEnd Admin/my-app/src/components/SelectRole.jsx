import "../Css/SelectRole.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";




export default function SelectRole({AcceptApiFunc,setRoleTab}){

const [selectedRole,setSelectedRole] = useState("")
const [password,setPassword]= useState("")


function handelAccept(){
    if(!selectedRole) return toast.warn("Select Role");
    if(selectedRole==="Owner" && password.length<4) return toast.warn("Enter Valid Password");
    AcceptApiFunc(selectedRole.toLowerCase(),password);
    setRoleTab(false);
}



return(
    <motion.div initial={{backdropFilter:"blur(0)"}} animate={{backdropFilter:""}} className="select-role">
<motion.div initial={{width:"4rem"}} animate={{width:""}} className="selectRoleTab">
<div className="optionValueField">
    <span>Select Role</span>
    <div className="roleSelectDiv">
        {
            ["Owner","Editor","Viewer"].map((item,index)=>{
                 return <button key={index} onClick={()=>{setSelectedRole(item)}} className={`rolloption ${item===selectedRole? "active" : ""} `}>{item}</button>
            })
        }
    </div>
</div>
<div style={selectedRole!=="Owner"?{height:0}:{}} className="optionValueField">
    <span>Password</span>
    <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type="password" />
</div>
<div className="selectRoleButtons">
        <button onClick={()=>{handelAccept()}} className="RollAccept">Accept</button>
        <button onClick={()=>{setRoleTab(false)}} className="RollDecline">Decline</button>
    </div>
</motion.div>
    </motion.div>
)
}