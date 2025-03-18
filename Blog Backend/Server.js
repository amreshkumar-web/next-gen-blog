const express = require("express");
const app = express();
const PORT=5000;
const loginRoutes =require("./Routes/Login");
const AccessManager =require("./Routes/AccessManagement");
const postRoutes = require("./Routes/PostManagement")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path=require("path")
require('./dbConnect');




app.use(cookieParser()); 
app.use(
    cors({
      origin: "http://localhost:5173", // Allow requests from frontend
      credentials: true, // Allow cookies
      methods: ["GET", "POST", "PUT", "DELETE","PATCH"], // Allowed methods
      allowedHeaders: ["Content-Type", "Authorization","x-fingerprint"], // Allowed headers
    })
  );




  app.use(express.json({ limit: '50mb' }));
app.use('/upload', express.static(path.join(__dirname, './upload')));

app.use(express.urlencoded({ limit: '50mb', extended: true }));




app.use('/user',loginRoutes);
app.use('/accessQueue',AccessManager);
app.use('/posts',postRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})