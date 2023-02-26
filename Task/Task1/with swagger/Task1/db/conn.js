const mongoose = require("mongoose");


//connection creation new database
mongoose.connect("mongodb://127.0.0.1:27017/Student-Data",
{useNewUrlParser:true,useUnifiedTopology:true})
.then( ()=>console.log("connection succesful"))
.catch((err)=>console.log("no connection"));