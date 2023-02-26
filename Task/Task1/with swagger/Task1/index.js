const express = require("express");
require("./db/conn");

const router = require("./routers/routes");

const app = express();
var cors= require("cors");
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(router);
app.use(cors());

app.listen(port,()=>{
    console.log(`connection is setup at ${port}`);
})