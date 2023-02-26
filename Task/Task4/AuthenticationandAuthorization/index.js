const express = require('express')
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')

const app = express()

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

mongoose.connection.on("connected",()=>{
    console.log("Connection successfully")
})

mongoose.connection.on("error",(err) =>{
    console.log("err"+err)
})

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>console.log(`Server is running at ${PORT}`))