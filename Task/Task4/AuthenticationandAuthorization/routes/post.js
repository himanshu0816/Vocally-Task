const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const Post = require('../model/post')
const router = express.Router()
const rateLimit=require('express-rate-limit')


const limit=rateLimit({
     max:4,
     message:'Sorry you tired too many times',
     windowMs:10000

})
//For Create Post
router.post("/createPost", requireLogin, (req, res) => {
     const { title, body, pic } = req.body
     if (!title || !body || !pic)
          return res.status(422).json({ error: "Please add all the Fields" })
     req.user.password = undefined
     req.user.__v = undefined

     const post = new Post({
          title,
          body,
          photo: pic,
          postedBy: req.user
     })
     post.save().then(result => res.json({ post: result }))
          .catch(err => console.log(err))

})

//For Post
router.get('/allpost', requireLogin, (req, res) => {
     Post.find()
          .populate("postedBy", "_id name")
          .then(posts => res.json(posts))
          .catch(err => console.log(err))
})

//For my Post
router.get('/mypost', requireLogin, (req, res) => {
     Post.find({ postedBy: req.user._id })
          .populate("postedBy", "_id name")
          .then(mypost => res.json({ mypost }))
})

//For Like
router.put("/like", requireLogin, limit,(req, res) => {
     Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.user._id } }, { new: true })
          .populate("postedBy", "_id name")
          .exec((err, result) => {
               if (err) return res.status(422).json({ err })
               else return res.json({ result })
          })
})

//For Unlike
router.put("/unlike", requireLogin, limit,(req, res) => {
     Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.user._id } }, { new: true })
          .populate("postedBy", "_id name")
          .exec((err, result) => {
               if (err) return res.status(422).json({ err })
               else return res.json({ result })
          })
})

//For comments
router.put("/comment", requireLogin, (req, res) => {
     const comment = {
          text: req.body.text,
          postedBy: req.user._id
     }
     console.log(comment)

     Post.findByIdAndUpdate(req.body.postId, {
          $push: { comments: comment }
     }, {
          new: true
     })
          .populate("comments.postedBy", "_id name")
          .populate("postedBy", "_id name")
          .exec((err, result) => {
               if (err) {
                    console.log(err)
                    return res.status(422).json({ error: err })
               }
               else
                    return res.status(200).json(result)
          })

})

//For Delete Post
router.delete("/deletepost/:postId", requireLogin,limit, (req, res) => {
     Post.findOne({ _id: req.params.postId })
          .populate("postedBy", "_id name")
          .exec((err, post) => {
               if (err || !post)
                    return res.status(422).json({ error: err })
               if (post.postedBy._id.toString() === req.user._id.toString()) {
                    post.remove()
                         .then(result => res.json({ result }))
                         .catch(error => console.log(error))
               } else {
                    return res.status(422).json({ error: "You can't delete another post" })
               }
          })
})


//For Subpost
router.get("/getsubpost", requireLogin, (req, res) => {
     Post.find({ postedBy: { $in: req.user.following } })
          .populate("postedBy", "_id name")
          .populate("comments.postedBy", "_id name")
          .then(posts => res.json({ posts }))
          .catch(err => console.log(err))
})
module.exports = router;

