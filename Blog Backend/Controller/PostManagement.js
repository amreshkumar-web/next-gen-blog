const postDb = require("../PostsDb");
const cloudinary = require("../StorageCloud/cloudinary")
const {JSDOM} = require('jsdom');
const sendResponse = require("../utils/SendResp");
const {v4: uuidv4} = require('uuid');
const moment = require('moment-timezone');
const jobScheduler = require('../utils/JobScheduler')




const postBlogData = async (req,resp) =>{
try {
   
    const { metaData, postContent,schedule } = req.body;
    //conver stringify data into normal musing parse
    const AllMetaDataObj= JSON.parse(metaData);
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

    const callSchedulerFunction = await jobScheduler(postId, scheduleTime, jUserId);
    if (!callSchedulerFunction) {
        return sendResponse(resp, 500, 'Something went wrong');
    }
}


const pushInDb = await postDb.create({
    PostId: postId,
    Status:schedule?"scheduled":"active",
    MetaData:AllMetaDataObj,
    PostContent:UpdatedDom,
    PostedBy:{userId:jUserId},
    PostedTime:Date.now()
})


if(pushInDb) return sendResponse(resp,201,"Post created successfully");

} catch (error) {
    console.error("Error creating post:", error.message);
    return sendResponse(resp,500,"Something went wrong")
}    

}

module.exports=postBlogData;