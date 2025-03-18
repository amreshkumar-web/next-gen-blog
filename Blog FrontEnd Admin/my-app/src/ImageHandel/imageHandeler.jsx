import imageCompression from "browser-image-compression";

const handleFileChange = async ({e,setUploadedImg,setCompressedImage}) => {
const file = e.target.files[0];
if(!file) return;

if(file.size > 2 * 1024 *1024){
    toast.warn("File size is too large");
    return;
}

const options={
    maxSizeMB:0.5,
    maxWidthOrHeight: 800, // Resize if needed
      useWebWorker: true,
};

try {
    const compressedImage = await imageCompression(file,options);
    setCompressedImage(compressedImage);
    setUploadedImg(URL.createObjectURL(compressedImage));
    
      return true;
} catch (error) {
    console.error("Image Compression Failed",error);
    return false;
}

}
export default handleFileChange;