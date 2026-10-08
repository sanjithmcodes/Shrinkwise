const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const LossEvent = require("../models/LossEvent");
const { ObjectId } = require("mongodb");

module.exports = {
    getProfile: async (req, res) => {
        try {
            
            const posts = await LossEvent.find({ user: req.user.id });
            res.send({userName: req.user.userName, email: req.user.email, posts: posts})
        } catch (err) {
            console.log(err);
        }
    },
    getFeed: async (req, res) => {
        try {
            const posts = await LossEvent.find({ user: req.user.id }).sort({ createdAt: "desc" }).lean();
            res.send({posts: posts})
            // res.render("feed.ejs", { posts: posts });
        } catch (err) {
            console.log(err);
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await LossEvent.findById(ObjectId(req.params.id));
            res.send({user: req.user.id, post: post})
            // res.render("post.ejs", { post: post, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
};
