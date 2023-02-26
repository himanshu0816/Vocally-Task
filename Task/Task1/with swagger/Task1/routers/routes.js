const express = require('express');
const router = new express.Router();
const Student = require('../models/students'); 
const swaggerJSDoc=require('swagger-jsdoc')
const swaggerui=require('swagger-ui-express');
const { version } = require('mongoose');

const app=express()
const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Node JS Project',
            version:'1.0.0'
        },
        severs:[
            {
            uri: 'http://localhost:8000'
            }
        ]
    },
    apis:['./routes.js']
}

const swaggerSpec=swaggerJSDoc(options)
app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerSpec))

router.get("/students",async(req,res)=>{

    try{
      const studentsData=  await Student.find();
      res.send(studentsData)
    }catch(e){
        res.send(e);

    }
})


router.post("/students",async(req,res)=>{

    try{
        const user = new Student(req.body);

        const createUser=await user.save();
        res.status(201).send(createUser);

        console.log(createUser)

    }catch(e){ res.status(400).send(e); }
    
})









router.patch("/students/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        const updateStudents = await Student.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.send(updateStudents);
    }catch(e){
        res.status(404).send(e);
    }
})

router.delete("/students/:id",async(req,res)=>{

    try{
        //const _id = req.params.id;
       const deleteStudent = await Student.findByIdAndDelete(req.params.id);
       if(!req.params.id){
           return res. status(404).send();
       }
       res.send(deleteStudent);
    }catch(e){
        res.status(500).send(e);
    }

});
module.exports = router;