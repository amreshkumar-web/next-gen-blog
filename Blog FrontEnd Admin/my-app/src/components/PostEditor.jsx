import { useEffect, useState } from "react";
import "../Css/PostEditor.css";
import MetaDataForm from "./MetaDataForm";
import api from "../utils/ApiHandel";

import MyEditor from "./MyEditor";
import { toast } from "react-toastify";
import Loading from "./Loading";
export default function PostEditor() {
  const [MetaData,setMetaData] = useState({});
  const [PostContent,setPostContent] = useState();
 const [finalData,setFinalData] =useState({});
 const [postGranted,setPostGranted] = useState(false)
const [loading,setLoading] = useState(false);

//This is for scheduling this state is taking value from their children state, which is my editorMy editor have a component which sides for scheduling. The scheduling will be settled, then it will be come from this component to this state
const [Scheduling,setScheduling] = useState(undefined);




 useEffect(() => {
  setFinalData({
    metaData: JSON.stringify(MetaData),
    postContent: JSON.stringify(PostContent),
    schedule:JSON.stringify(Scheduling)
  });
  /* console.log(JSON.stringify(PostContent)); */
}, [PostContent]);






// ✅ Jab finalData update ho jayega tabhi API call hoga
useEffect(() => {
  console.log(Scheduling);
  if (finalData.metaData && finalData.postContent) {
    handelPostApi();
  }
}, [finalData]);






//post api

const handelPostApi = async () =>{
  setLoading(true);
try {
  const response= await api.post("/posts/PostblogData",finalData);
  if(response.status>=200 && response.status<300){
    setLoading(false);
    localStorage.removeItem('metaDataForm')
    setMetaData({});
    setPostContent();
    setFinalData({})
    
    return toast.success("Post Published Successfully");
  }
} catch (error) {
  console.log("blogPostApiError",error);
  toast.error(error.response.data?.message || "Something Went Wrong");
}
}





  return (
    <>
      <div className="PostEditorParent">
       
       {
        loading ? <Loading Data="On way"/> : Object.keys(MetaData).length<1?<MetaDataForm setMeta={setMetaData}/>: <MyEditor  forSheduling={setScheduling} setMeta={setMetaData} setPostsData={setPostContent}/>
       }
       
      </div>
    </>
  );
}
