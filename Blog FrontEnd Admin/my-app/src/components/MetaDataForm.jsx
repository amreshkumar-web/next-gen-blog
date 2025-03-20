import "../Css/MetaDataForm.css"
import { motion } from "framer-motion";
import { initializeSal } from "../utils/SalJs"
import { useEffect, useRef, useState } from "react";
import { BiReset } from "react-icons/bi";
import { GrFormNextLink } from "react-icons/gr";
import MessageBox from "./MessageBox";
import { toast } from "react-toastify"

export default function MetaDataForm({ setMeta}) {



    //handel by parent component
    function nextHandel() {
        const updatedKeys = Object.keys(MetaValue).reduce((result,currentKey)=>{
            if(currentKey==="Slug"){
                result["Slug"] = MetaValue[currentKey].join('/');
               return result;
            }
            const newKey = currentKey.replaceAll(' ','_');
            result[newKey] = MetaValue[currentKey];
            return result;
        },{})
        setMeta(updatedKeys);
    }

    function reset() {
        setMetaValue({});
        localStorage.removeItem('metaDataForm');
    }




    const MetaData = [
        { 
            field: "Title", 
            limit: 60, 
            description: "The title is the main heading that appears in search engine results (like Google). It’s the first thing people see, so it should clearly describe what the page is about. Keep it short (under 60 characters) so that it displays fully without being cut off. Use relevant keywords that match what users are searching for, but avoid stuffing too many words as it can confuse readers and search engines." 
        },
        { 
            field: "Meta Description", 
            limit: 160, 
            description: "The meta description is a short summary that appears below the title in search results. It helps users understand what the page is about before clicking. It should be clear, engaging, and informative, encouraging people to visit your page. Use action-driven language (like 'Learn more', 'Discover', 'Find out') and keep it under 160 characters so it doesn’t get cut off." 
        },
        { 
            field: "Meta Keyword", 
            limit: 10, 
            description: "Meta keywords are specific words or phrases related to your content that help search engines understand what your page is about. Choose 5 to 10 highly relevant keywords that match what people are searching for. For example, if your page is about 'healthy recipes', keywords could include 'low-carb recipes', 'quick meals', 'healthy breakfast', etc." 
        },
        { 
            field: "Slug", 
            limit: 5, 
            description: "A slug is the part of the URL that identifies a specific page. For example, in 'www.example.com/contact', 'contact' is the slug. A clear and short slug (3 to 5 words) helps search engines and users understand the page’s purpose. Keep it simple and relevant to the content of the page (e.g., 'about-us' or 'product-details')." 
        },
        { 
            field: "Canonical URL", 
            limit: 100, 
            description: "A canonical URL is the preferred version of a webpage that tells search engines which link to prioritize when there are similar or duplicate pages. For example, if you have multiple URLs like 'example.com/page' and 'example.com/page?ref=123', the canonical URL helps search engines know which one to display. Keep it under 100 characters and use consistent formatting." 
        },
        { 
            field: "Author", 
            limit: 50, 
            description: "The author field names the person who created the content. It helps build credibility and trust with readers. If the author is an expert or well-known, including their name can improve user engagement. Keep it under 50 characters to ensure it looks neat in the display." 
        },
        { 
            field: "Category", 
            limit: 30, 
            description: "The category helps group related content together and makes it easier for users and search engines to understand the topic. For example, if you’re writing about 'digital marketing', you can categorize it under 'Marketing' or 'Online Business'. Keep it under 30 characters for a clean display." 
        },
        { 
            field: "OG Title", 
            limit: 60, 
            description: "The Open Graph (OG) title is what appears when your content is shared on social media platforms like Facebook and LinkedIn. It should match the page's main title but can be slightly more engaging to attract clicks. Keep it under 60 characters so it displays properly without being cut off." 
        },
        { 
            field: "OG Description", 
            limit: 160, 
            description: "The Open Graph (OG) description is a short summary that appears when your content is shared on social media. It should be clear and enticing, encouraging users to click. Mention the main value or benefit the user will get from reading the content. Keep it under 160 characters for a clean look." 
        }
    ];

    const [MetaValue, setMetaValue] = useState({});
    const [BackUpData, setBackUpData] = useState(false);
    const debouceRef = useRef(null);
    const MountCheck = useRef(true);

    useEffect(() => {
        initializeSal();
        MountCheck.current = false;
        return () => clearTimeout(debouceRef.current);
    }, []);

    useEffect(() => {
        const localData = localStorage.getItem('metaDataForm');
        if (localData) {
            const localParseData = JSON.parse(localData);

       /*  Object.keys(localParseData).forEach((item,index)=>{
            if(localParseData[item]){
                setBackUpData(true);
                setMetaValue(localParseData);
                return;
            }
        })  */
         const BackupValueCheck=  Object.values(localParseData).some(value => Array.isArray(value) 
         ? value.length > 0 && !(value.length === 1 && value[0] === "") // Array ke liye check
         : Boolean(value))

         if(BackupValueCheck){
            setBackUpData(true);
            setMetaValue(localParseData);
         }
         else{
            setMetaValue({})
         }

        }
    }, []);

  
    useEffect(() => {
        clearTimeout(debouceRef.current);
        if (!MountCheck.current) {
            debouceRef.current = setTimeout(() => {
                localStorage.setItem('metaDataForm', JSON.stringify(MetaValue));
            }, 1000);
        }
    }, [MetaValue]); // 👈 Changed from MetaData to MetaValue

    function handeMeta(field, value) {
        setMetaValue(prev => ({ ...prev, [field]: value }));
    }

    
    function handelBackupData(val) {
        if (!val) {
            localStorage.removeItem("metaDataForm");
            setBackUpData(false);
            setMetaValue({});
            return;
        }
        const savedData = JSON.parse(localStorage.getItem("metaDataForm"));
        setMetaValue(savedData);
        setBackUpData(false);
    }


    //word limits
    function wordCount(field,values,limit){
      
         const keywordsVal = values.split(" ");
         if(keywordsVal.length<=limit){
            setMetaValue((prev)=>({...prev,[field]:keywordsVal}));
         }
         else{
            toast.warn("Keyword limit excced");
         }
    }

    return (
        <>
         
       <div className="mainControlerMetaDataForm">

       {(localStorage.getItem("metaDataForm") && BackUpData )  && (
  <MessageBox 
    Message="Recover Previous Data ?" 
    Accept="Yes" 
    Reject="No" 
    functionName={handelBackupData}
  />
)}
       <motion.div   initial={{width:"50%",height:"50%"}} animate={{width:"",height:""}} className="MetaDataFormParent">
        
           <span>Meta tag</span>
            {

                MetaData.map((item,index)=>{
                    const {field,limit,description} = item;
                    return <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{ delay: index / 2,
                        duration: 1, // in seconds
                        ease: "easeInOut"}} className="metaInputDiv">
                        <div className="shinnyHandelContainer">
                        <div className="shinyMetaDiv"></div>
                        </div>
                      <span>{field}</span>
                      <p>{description}</p>
                      {



                        (field === "Meta Keyword" || field ==="Slug")
                         ?
                          <textarea value={Array.isArray(MetaValue[field])?MetaValue[field].join(" "):""}  onChange={(val)=>{wordCount(field,val.target.value,limit)}}  /> 
                        :
                         <textarea value={MetaValue[field] || ""}  onChange={(val)=>{handeMeta(field,val.target.value)}}  maxLength={limit} />

                      }

                    </motion.div>
                })
            }

            <div className="MetaTagNextBtn">
                <button onClick={()=>{reset()}} className="Reset" aria-label="Reset"> Reset <BiReset /></button>
                <button onClick={()=>{nextHandel()}} className="Next" aria-label="Next">Next <GrFormNextLink /></button>
            </div>
        </motion.div>




       </div>
        </>
    );
}
