import Lottie from "lottie-react";
import animationData from "../assets/loadingAnimation.json"

export default function Loading({Data}){
  return(
    <div style={{width:"100%",height:"100vh",backgroundColor:"#19CC8B",display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden",flexDirection:"column"}} className="loader">

    <Lottie animationData={animationData} style={{ width: 100, height: 100 }} loop={true} />
   <p style={{fontSize:"1.3rem",color:"rgba(0, 0, 0, 0.26)"}}>{Data}</p>
    </div>
  )
}