const express = require('express');
const router = new express.Router();
const Student = require('../models/students'); 
const { version } = require('mongoose');

router.post("/students",async(req,res)=>{

    try{
        const user = new Student(req.body);

        const createUser=await user.save();
        res.status(201).send(createUser);

        console.log(createUser)

    }catch(e){ res.status(400).send(e); }
    
})

module.exports = router;