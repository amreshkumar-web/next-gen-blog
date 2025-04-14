const postDb = require("../PostsDb");
const cloudinary = require("../StorageCloud/cloudinary")
const {JSDOM} = require('jsdom');
const sendResponse = require("../utils/SendResp");
const {v4: uuidv4} = require('uuid');
const moment = require('moment-timezone');
const {jobScheduler} = require('../utils/JobScheduler');
const { default: mongoose } = require("mongoose");


/**
 * Handles blog data received from the frontend.
 * 
 * Responsibilities:
 * 1. Converts the string-formatted DOM content into a DOM structure.
 * 2. Traverses all <img> tags within the DOM, uploads their `src` to Cloudinary,
 *    retrieves the secure URL, and updates the `src` attribute of each <img> tag.
 * 3. Posts the blog data after processing.
 * 4. If a scheduled time is provided from the frontend, schedules the blog post
 *    for that specific time instead of posting it immediately.
 */

const postBlogData = async (req,resp) =>{
try {
   
    const { metaData, postContent,schedule } = req.body;
    //conver stringify data into normal musing parse
    const AllMetaDataObj= JSON.parse(metaData);
    let BlogThumbNail=null;
    const {jUserId,jAccess} = req.user;
    if(jAccess==="viewer") return sendResponse(resp,400,"You don't have permission")
        if (!metaData || !postContent) {
            return sendResponse(resp, 400, "Invalid data");
        }

        //Converting post content into I.can track the image element into it.
        const dom= new JSDOM(postContent);
    const document = dom.window.document;
    const images=document.querySelectorAll('img');
    //After selecting all the images, I just have to create a unique id.So so the unique id is also used in to create a post id, which is.unique for every post.
    const uniqueId= uuidv4().split('-')[0];
    const postId = `${AllMetaDataObj.Slug.replace(/\//g, '-')}-${uniqueId}`;
    
   // I'm using `Promise.all` to upload all images to the cloud in parallel, 
// which improves performance. If I used a loop instead, it would process each 
// upload one by one, making the time complexity O(n).  
// But `Promise.all` allows all uploads to happen simultaneously, reducing the 
// time complexity to O(1).  
// 
// I'm using the `map` function to iterate over the images because it works on arrays. 
// However, when I select image elements from the DOM using methods like `querySelectorAll`, 
// it returns a `NodeList`, which is not an array.  
// To fix this, I convert the `NodeList` to an array using `Array.from()` or the 
// spread operator (`[...]`) before using `map` for iteration.

    await Promise.all([...images].map( async (img)=>{
       
        const src = img.getAttribute('src');
        const cleanSrc = src.slice(2, -2); // Start ke \" aur end ke \" remove
        if(cleanSrc?.startsWith('data:image')){
             const imageName = `${AllMetaDataObj.Slug.replace(/\//g, '-')}-${Date.now()}`
             console.log(imageName)
             try {  
                
            const result = await cloudinary.uploader.upload(cleanSrc,{
                   folder:postId,
                   public_id:imageName,
                   resource_type: 'image',
                   quality:'auto',
                   format:'webp'
            })
          
            const imageUrl = result.secure_url;
            const publicId = result.public_id;
            img.setAttribute('src', imageUrl);
            img.setAttribute('data-public-id', publicId);
            if(!BlogThumbNail){
                BlogThumbNail=imageUrl; 
            }
            } catch (error) {
                console.log("Image upload failed:", error.message);
                throw new Error(`Image upload failed for ${imageName}: ${error.message}`); // 👈 Yeh signal dega Promise.all ko
            }
        } 
    }




))
const UpdatedDom=dom.serialize();

// Extracting all the scheduling data from the incoming object using object destructuring.
// The scheduling data includes `date`, `time`, and `timeZone` fields.

/* Acid Transaction becaause of tightly coupled operation*/



const pushInDb = await postDb.create({
    Thumbnail:BlogThumbNail,
    PostId: postId,
    Status:schedule?"scheduled":"active",
    MetaData:AllMetaDataObj,
    PostContent:UpdatedDom,
    PostedBy:{userId:jUserId},
    PostedTime:Date.now()
})
if(!pushInDb) return sendResponse(resp,500,"Something went wrong");

const postDbId = pushInDb._id;

if(schedule){
    const { date, time, timeZone } = JSON.parse(schedule);
    if (!date || !time || !timeZone) {
        return sendResponse(resp, 400, "Invalid schedule data");
    }

    const dateTimeString = `${date}T${time}`;
    const scheduleTime = moment.tz(dateTimeString, timeZone).toDate();

    if (!scheduleTime) {
        return sendResponse(resp, 400, "Invalid schedule time");
    }

    const callSchedulerFunction = await jobScheduler(postDbId, scheduleTime, jUserId);
    if (!callSchedulerFunction) {
        return sendResponse(resp, 500, 'Something went wrong');
    }
}


return sendResponse(resp,201,"Post created successfully");

} catch (error) {
    console.error("Error creating post:", error);
    return sendResponse(resp,500,"Something went wrong")
}    

}

//end of Post Handling



const fetchingBlogsForAdmin = async (req,resp) => {
    try {
        console.log("hit");
        const AllBlogs= await postDb.find({}).select("-PostContent -MetaData").populate('PostedBy.PostedByData', 'Name')
        .populate('EditedBy.EditedByData', 'Name').lean();
        if(!AllBlogs) return sendResponse(resp,400,"Data Not Found");
        return sendResponse(resp,200,AllBlogs);
    } catch (error) {
        console.error("Error fetchingBlogsForAdmin:", error);
        return sendResponse(resp,500,"Something went wrong")
    }
}











module.exports={postBlogData, fetchingBlogsForAdmin};