import "../Css/SideMenu.css"
import { useState,useEffect ,useRef} from "react";
import { FaBlog } from "react-icons/fa";
import { SiLibreofficewriter } from "react-icons/si";
import { IoPerson } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import Hamburger from 'hamburger-react'
import { motion } from "framer-motion"; 
import { NavLink,useNavigate } from "react-router-dom"; 
import profileImageDummy from "../assets/menProfile.jpg"
import {useSelector } from "react-redux"
import { RiLogoutCircleLine } from "react-icons/ri";
import { toast } from "react-toastify";
import api from "../utils/ApiHandel.js"


export default function SideMenu(){
 
  const navigate=useNavigate();
  const user = useSelector((state) => state.user)
 /* const{Name,_id,Access} = profile.profile.profileData */
    const [isOpen, setOpen] = useState(false);
    const [hoverPosition, setHoverPosition] = useState(0); // Index of hovered item
    const [selectedIndex, setSelectedIndex] = useState(0); // Index of clicked item
    const [activeButton, setActiveButton] = useState("AllBlog");
    const hoverRef = useRef(null);
  /* console.log(Name,_id,Access); */
     const menuItems = [
        { id: "AllBlogs", icon: <FaBlog style={{zIndex:"999" }} />, label: "All Blogs" },
        { id: "WritePost", icon: <SiLibreofficewriter style={{zIndex:"999" }} />, label: "Write Post" },
        { id: "NewRegister", icon: <IoPerson style={{zIndex:"999" }} />, label: "New Register" },
        { id: "AccessList", icon: <MdAdminPanelSettings style={{ fontSize: "2rem",zIndex:"999" }} />, label: "Access List" }
      ];




// ✅ Move div on hover (No re-render)
const handleHover = (index) => {
  requestAnimationFrame(() => {
    if (hoverRef.current) {
      hoverRef.current.style.transform = `translateY(${index * 5}rem)`;
    }
  });
};

// ✅ Reset to clicked position when hover leaves
const handleMouseLeave = () => {
  requestAnimationFrame(() => {
    if (hoverRef.current) {
      hoverRef.current.style.transform = `translateY(${selectedIndex * 5}rem)`;
    }
  });
};


    
      const handleClick = (index,id) => {
        setSelectedIndex(index);
        setActiveButton(id);
      };
    
     /*  const handleMouseLeave = () => {
        setHoverPosition(selectedIndex);
      }; */

      const handelClickedActive = (val) =>{
        setCurrentClicked(val)
      }


  const handelLogout = async () =>{
     try {
    
      const response = await api.post('/user/loggedOut');
      if(response.status >=200 && response.status<300){
        toast.success(response.data.message);
        navigate("/login");
      }
      else{
        toast.warn("Something went wrong");
      }
      
     } catch (error) {
      toast.error(error.response.data.message);
      console.log("handelLogout",error)
     }
  }



return(
    <div style={!isOpen?{width:"10rem",paddingInline:"10px"}:{width:""}} className="sideMenuParent">
        <motion.div initial={{height:"50rem"}} animate={{height:""}}  className="sideMenuOption">
           <div style={!isOpen?{paddingLeft:"11px"}:{}} className="logo-toggel">{isOpen?<span>Admin</span>:null} <Hamburger 
        toggled={isOpen} 
        toggle={setOpen} 
        size={18}  // Smaller hamburger
        distance="sm" // Reduces gap between lines (thinner appearance)
        color="white"
        duration={0.4}  // Smooth animation
      /></div>
           <div className="allMenuOptions">
           <div
        className="selectedOption"
        ref={hoverRef}
        /* style={{
            transform: `translateY(${hoverPosition * 5}rem)`,
            width: isOpen ? "" : "80%"
          }} */ // Uses transform instead of top
      ></div>
          {menuItems.map((item, index) => (
        <NavLink to={`/${item.id}`}>
            <button
        
        key={item.id}
        className={`menuOptionButton ${activeButton === item.id ? "active" : ""}`}
        onMouseEnter={() => handleHover(index)}
        onClick={() => handleClick(index,item.id)}
        onMouseLeave={handleMouseLeave}
        style={!isOpen?{paddingLeft:"30px"}:{paddingLeft:""}}
      >
        {item.icon}{isOpen ? <span>{item.label}</span> : null}
      </button>
        </NavLink>
      ))}

           </div>
           <div className="adminDetails">
            <div className="adminProfileImage"><img src={user?.profileimage?user.profileimage:profileImageDummy} alt="" /></div>
            {isOpen ? 
            <>
            <div className="profileName">
            <span>{user?.name}</span>
            <div className="sctiveAndAccess">
                <div className="sideMenuOnline"></div>
            <span>{user?.access}</span>
            <div onClick={()=>{handelLogout()}} className="logout"><RiLogoutCircleLine style={{fontSize:"1.8rem"}}/><span>Logout</span></div>
            </div>
        </div>
        
            </>
        :
        null}
        
           </div>
        </motion.div>
    </div>
)


}