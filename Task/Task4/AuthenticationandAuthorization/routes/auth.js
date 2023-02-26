const express = require('express')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup',(req,res) =>{
    const {name,email,password} =req.body
    // console.log(req.body)
    if(!email || !name || !password){
        res.status(422).json({error:"Please Add all the Fields"})
    }else{
            User.findOne({email:email})
                .then(savedUser =>{
                    if(savedUser){
                        return res.status(422).json({error:"User Already exsists"})
                    }else{
                        bcrypt.hash(password,12)
                                .then(hashedPassword =>{
                                    const user1  =  new User({
                                        name,
                                        email,
                                        password:hashedPassword
                                    })
                                    user1.save()
                                        .then(user =>{
                                            res.status(200).json({msg:"User Added Succesfully"})
                                        })
                                        .catch(err => console.log(err))
                                })
                    }
                })
    }
})

router.post('/signin',(req,res) =>{
    const {email,password} = req.body
    if(!email || !password) {
        return res.status(422).json({error:"Please add Email and Password"})
    }
    User.findOne({email:email})
        .then(savedUser =>{
            if(!savedUser)
            return res.status(422).json({error:"Invalid Email"})
            bcrypt.compare(password,savedUser.password)
                    .then(doMatch =>{
                        if(doMatch){
                            const token = jwt.sign({id:savedUser._id},JWT_SECRET)
                            const {_id,name,email,followers,following,pic} = savedUser
                            return res.json({token,user:{_id,name,email,followers,following,pic}})
                        }else{
                            return res.status(422).json({error:"Invalid Password"})
                        }
                    })
        })

})

router.get("/protected",requireLogin,(req,res) =>{
    req.password=undefined
    // console.log(req)
    res.send("protected!!!")
})


module.exports = router
