const postDb = require("../PostsDb");
const cloudinary = require("../StorageCloud/cloudinary")
const {JSDOM} = require('jsdom');
const sendResponse = require("../utils/SendResp");
const {v4: uuidv4} = require('uuid');

const postBlogData = async (req,resp) =>{
try {
    const startTime = Date.now();
    const { metaData, postContent } = req.body;
    
    const AllMetaDataObj= JSON.parse(metaData);
    const {jUserId,jAccess} = req.user;
    if(jAccess==="viewer") return sendResponse(resp,400,"You don't have permission")
        if (!metaData || !postContent) {
            return sendResponse(resp, 400, "Invalid data");
        }
        const dom= new JSDOM(postContent);
    const document = dom.window.document;
    const images=document.querySelectorAll('img');
    const uniqueId= uuidv4().split('-')[0];
    const postId = `${AllMetaDataObj.Slug.replace(/\//g, '-')}-${uniqueId}`;
    

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
const pushInDb = await postDb.create({
    PostId: postId,
    Status:"active",
    MetaData:AllMetaDataObj,
    PostContent:UpdatedDom,
    PostedBy:{userId:jUserId},
    PostedTime:Date.now()
})
const endTime = Date.now();
const timeTaken = endTime - startTime;
console.log("time taken is " , timeTaken);
if(pushInDb) return sendResponse(resp,201,"Post created successfully");

} catch (error) {
    console.error("Error creating post:", error.message);
    return sendResponse(resp,500,"Something went wrong")
}    




}

module.exports=postBlogData;