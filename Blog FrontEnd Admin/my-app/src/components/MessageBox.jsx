import "../Css/MessageBox.css"
import { motion } from "framer-motion";
export default function MessageBox({Message,Accept,Reject,functionName}){
    return(
        <>
        <motion.div initial={{backdropFilter:"blur(0)"}} animate={{backdropFilter:""}} className="MessageBoxParent">
      <motion.div initial={{width:"6rem"}} animate={{width:""}} className="MessageBox">

      <div className="MessageText">
        <motion.p initial={{opacity:"0"}} animate={{opacity:"1"}} >{Message}</motion.p>
        </div>

        <div className="MessageReplyBtn">
            <button onClick={()=>{functionName(true)}}  className="MessageAccept">{Accept}</button>
            <button onClick={()=>{functionName(false)}} className="MessageReject">{Reject}</button>
        </div>
      </motion.div>
      

        </motion.div>
        
        
        </>
    )
}