import { useEffect, useState } from "react"
import api from "../utils/ApiHandel"
import PostCard from "./PostCards";

export default function AllBlogs(){
const [postData,setPostData] = useState([])
const [dataCleaning,setDataCleaning] = useState([]);


useEffect(()=>{

const newArray = postData.reduce((result,current)=>{
  const {
    EditedBy: { userId: editerUserId },
    PostedBy: { userId:{_id:postedById,Name} },
    ...AllData} = current;
  
  result.push({
      editerUserId,
      postedByUserId: postedById,
      postedByName: Name,
      ...AllData
    });     return result;
},[])

setDataCleaning(newArray);

},[postData])



    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get('/posts/AllBlogs');
            if (!response) return;
            setPostData(response.data.message);
          } catch (error) {
            console.log('error in API', error);
          }
        };
      
        fetchData();
    
      }, []);

    return(
      dataCleaning &&
        <>
         <PostCard cardData ={dataCleaning[0]}/>
        
        </>
    )
}