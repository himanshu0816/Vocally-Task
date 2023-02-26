const express = require('express');
const router = new express.Router();
const Student = require('../models/students'); 

//update the students by it id
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

module.exports = router;