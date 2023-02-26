const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const User = require('../model/user')
const Post = require('../model/post')
const router = express.Router()
const rateLinmit=require('express-rate-limit')


const limit=rateLinmit({
    max:4,
    message:"You tired too many times",
    windowMs:10000
})

router.get("/user/:id",limit, requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    } else {
                        return res.status(200).json({ user, posts })
                    }
                })
        })
})


router.put('/follow', limit,requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id } // For followId user
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId } // For user login id
        }, {
            new: true
        })
            .select("-password")
            .then(result => res.json(result))
            .catch(err => console.log(err))
    })
})




module.exports = router