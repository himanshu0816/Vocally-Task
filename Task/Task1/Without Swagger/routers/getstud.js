const express = require('express');
const router = new express.Router();
const Student = require('../models/students'); 
//read data of registred Student

router.get("/students",async(req,res)=>{

    try{
      const studentsData=  await Student.find();
      res.send(studentsData)
    }catch(e){
        res.send(e);

    }
})





module.exports = router;
