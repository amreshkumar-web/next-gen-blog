import "../Css/NewRegister.css"
import { motion } from "framer-motion"
import api from  "../utils/ApiHandel"
import { useEffect, useState,useRef } from "react"
import { toast } from "react-toastify"
import { initializeSal } from "../utils/SalJs"
import { CiSearch } from "react-icons/ci";
import Loading from "./Loading"
import { TfiReload } from "react-icons/tfi";
import SelectRole from "./SelectRole"
import { useNavigate } from "react-router-dom"


export default function NewRegister(){
    const navigate=useNavigate();
const [RegisterData,setRegisterData] = useState([]);
const [filteredData,setFilterData] = useState();
const [isLoading,setIsLoading] = useState(true);
const [searchValue,setSearchValue] = useState("");
const [refresh, setRefresh] = useState({ animation: "none" });
const [AcceptReqUserId,setAcceptReqUserId] = useState("");


//from password and role tab

const [roleTab,setRoleTab] = useState(false);




function handelAccept(userId){
    if(!userId) return toast("Invalid user");
    setAcceptReqUserId(userId)
    setRoleTab(true);

}




//accept request Api

const AcceptRequestApi = async (Role,Password) =>{
    if(!Role) return toast.warn("No Role Assinged");
    if(Role==="Owner" && Password.length<4) return toast.warn("Invalid Password")
    try {
        const response = await api.post("/accessQueue/requestAccept",{
            userId:AcceptReqUserId,
            AccessRole:Role,
            password:Password
          });
    
          if(response.status>=200 && response.status<300){
              setRegisterData(RegisterData=>RegisterData.filter(user=>user._id !==AcceptReqUserId));
              setFilterData(filteredData=>filteredData.filter(user=>user._id!==AcceptReqUserId));
              return toast.success("Request Accepted");
            }
          else{
            return toast.warn(response.data.message)
          }
    } catch (error) {
        console.log("AcceptreqApi" , error);
        return toast.error(error.response.data.message)
    }
}





useEffect(() => {
    
    const trimmedSearch = searchValue.trim();
    
    if (trimmedSearch === "") {
        
        setFilterData(RegisterData);
        // Reset if search is empty
    } else {
        const matchedUsers = RegisterData.filter(user => 
            user.Name.toLowerCase().includes(searchValue.toLowerCase()) || user.Email.toLowerCase().includes(trimmedSearch)
        );
    
        setFilterData(matchedUsers); 
    }
    setTimeout(() => {
        initializeSal();
    }, 100);
    
}, [searchValue, RegisterData]); // ✅ Ensure RegisterData is a dependency


const fetchingRegisterData = async () =>{
    
    try {
        const response = await api.get("/accessQueue/RegistrationQueue")
        
        if(response.status >=200 && response.status <300){
            setRegisterData(response.data.data);
            setFilterData(response.data.data);
            toast.success("Data Fetched");
            setIsLoading(false);
            initializeSal();
            
        }
        
    } catch (error) {
        
        console.log("register Fetching Data Error",error)
        toast.error("Something went wrong");
        navigate("/login")
    }
    
}




useEffect(()=>{
    fetchingRegisterData();
},[])


async function deleteUser(userId){
 
    const response = await api.delete(`/accessQueue/DeleteRegistrationRequest/${userId}`);
    if(response.status>=200 && response.status<300){
        toast.success("User Deleted");
        setRegisterData(RegisterData=>RegisterData.filter(user=>user._id !==userId));
        setFilterData(filteredData=>filteredData.filter(user=>user._id!==userId));
    }
    else{
        toast.error("Something went wrong");
    }
}



function handelRefresh() {
    setRefresh({ animation: "rotateAnimation 03s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" });
    
    setTimeout(() => {
        setRefresh({ animation: "none" });
    }, 5000);
}




    return (
        <>
        
        {
            isLoading ? <Loading styling={{width:100,height:100}}/> :
            <motion.div  initial={{width:"50%",height:"50%"}} animate={{width:"",height:""}} className="NewRegisterParent">

           {
            roleTab?<SelectRole AcceptApiFunc={AcceptRequestApi} setRoleTab={setRoleTab} />:null
           }


{/* <SelectRole /> */}
        <div className="allAttributesRegister">
            <div id="rNumber" className="registerAtrributeField">S.no</div>
            <div id="rName" className="registerAtrributeField">Name</div>
            <div id="rEmail" className="registerAtrributeField">Email</div>
            <div id="rDate" className="registerAtrributeField">Date</div>
            <div id="rButtons"  style={{paddingRight:"10px",gap:"20px"}} className="registerAtrributeField">
             <div style={refresh} className="reloader" onClick={()=>{fetchingRegisterData(); handelRefresh();}}><TfiReload/></div>
             <div className="registerSearch">
             <CiSearch style={{color:"black",fontSize:"3rem"}}/>
             <input onChange={(e)=>{setSearchValue(e.target.value)}} value={searchValue} type="text" className="filterSearch"/>
             </div>

            </div>
            {/* <div className="registerAtrributeField"></div> */}
        </div>

        <div  className="registerDataContainer">
        {
          filteredData.map((item,index)=>{
            const {Name,Email,Date,_id} = item;
          return (
            <div data-sal="slide-up" data-sal-delay={index*100} data-sal-easing="ease-in-out" className="registerDataDisplayed">
            <div id="rNumber" className="registerAtrributeField"><span>{index+1}</span></div>
            <div id="rName" className="registerAtrributeField"><span>{Name}</span></div>
            <div id="rEmail" className="registerAtrributeField"><span>{Email}</span></div>
            <div id="rDate" className="registerAtrributeField"><span>{Date}</span></div>
            <div id="rButtons" className="registerAtrributeField">
            <button onClick={()=>{handelAccept(_id)}} id="rAccept" data-userId={_id} aria-label="Accept">Accept</button>
             <button onClick={()=>{deleteUser(_id)}} id="rReject" data-userId={_id} aria-label="Delete">Delete</button> 
            </div>
            
        </div>
          )


          })
        }
        </div>
        </motion.div>
        }
        
        
        
        </>
    )
}