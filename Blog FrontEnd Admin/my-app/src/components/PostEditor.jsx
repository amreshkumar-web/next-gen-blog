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

 useEffect(() => {
  setFinalData({
    metaData: JSON.stringify(MetaData),
    postContent: JSON.stringify(PostContent),
  });
  /* console.log(JSON.stringify(PostContent)); */
}, [PostContent]);

// ✅ Jab finalData update ho jayega tabhi API call hoga
useEffect(() => {
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
        loading ? <Loading Data="On way"/> : Object.keys(MetaData).length<1?<MetaDataForm setMeta={setMetaData}/>: <MyEditor setMeta={setMetaData} setPostsData={setPostContent}/>
       }
       
      </div>
    </>
  );
}
