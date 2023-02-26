const express = require('express')
const members = require('./Members')
const uuid = require('uuid')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

//get all Members
app.get('/api/members',(req,res) =>{
    return res.status(200).json({members})
})

//Get a specific members
app.get('/api/members/:id',(req,res) =>{
    // console.log(req.params.id)
const found = members.some(m =>m.id === parseInt(req.params.id))
// console.log(found)
if(found){
    return res.json(members.filter(m => m.id === parseInt(req.params.id)))
}else{
return   res.status(400).json({msg:`No member found with this ${req.params.id} id`})
}
})

//Post or Add a new Resource
app.post('/api/members',(req,res) =>{
    // console.log("test")
    console.log(req.body)
    const{email,name} =  {...req.body}//Object descurting
    console.log(name,email)
    const newMember = {
        id:uuid.v4(),
        name,
        email,
        status:'active'
    }
    if(!newMember.name || !newMember.email){
        return  res.status(400).json({msg:'Please include an email and name'})
    }else{
        members.push(newMember)
        return res.status(200).json({msg:"Member Added Succesfully",members})
    }
})

app.put('/api/members/:id',(req,res)=>{
    console.log(req.params.id)
    const found = members.some(member => member.id === parseInt(req.params.id))
    if(found){
        const updMember = req.body;
        members.forEach(member => {
            if(member.id === parseInt(req.params.id)){
                member.name = updMember.name;
                member.email = updMember.email;
                res.json({msg:'Member updated',member})
            }
        })
    }
    else{
        res.status(400).json({msg:`No member found with id of ${req.params.id}`});
    }
})

app.delete('/api/members/:id',(req,res) =>{
    const found = members.some(member => member.id === parseInt(req.params.id))
    if(found){
    const users = members.filter(member => member.id !== parseInt(req.params.id))
    res.status(200).json({msg:'Member Deleted!!!',members:users}) 
    }else{
        res.status(400).json({msg:`No member found with the id of ${req.params.id}`})
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`Server running at ${PORT}`))