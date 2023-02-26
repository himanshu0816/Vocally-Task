const express = require('express');
const router = new express.Router();
const Student = require('../models/students'); 

//Delete the Student by it id
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


module.exports=router;