const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Blog")
    .then(() => {
        console.log("Connected with DataBase");
    })
    .catch((e) => {
        console.log("Not connected");
        console.log(e);
    });
