const cloudinary = require("../middleware/cloudinary");
const LossEvent = require("../models/LossEvent");
const { ObjectId } = require("mongodb");

module.exports = {
    getProfile: async (req, res) => {
        try {
            const lossEvents = await LossEvent.find({ user: req.user.id });
            res.send({userName: req.user.userName, email: req.user.email, lossEvents: lossEvents})
        } catch (err) {
            console.log(err);
        }
    },
    getFeed: async (req, res) => {
        try {
            const lossEvents = await LossEvent.find().sort({ createdAt: "desc" }).lean();
            res.send({lossEvents})
            // res.render("feed.ejs", { posts: posts });
        } catch (err) {
            console.log(err);
        }
    },
    getLossEvent: async (req, res) => {
        try {
            const lossEvent = await LossEvent.findById(ObjectId(req.params.id));
            res.send({user: req.user.id, lossEvent})
            // res.render("post.ejs", { post: post, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    createLossEvent: async (req, res) => {
        try {
            const eventData = {
                type: req.body.type,
                category: req.body.category,
                description: req.body.description,
                date: req.body.date,
                favourited: false,
                user: req.user.id,
                image: 'https://static.thenounproject.com/png/1077596-200.png',
                cost: req.body.cost,
                quantity: req.body.quantity,
            };

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                eventData.image = result.secure_url;
                eventData.cloudinaryId = result.public_id;
            }

            await LossEvent.create(eventData);

            res.sendStatus(200);
            console.log("Loss event has been added!");
        } catch (err) {
            console.log(err);
        }
    },
    favouriteLossEvent: async (req, res) => {
        try {
            await LossEvent.findOneAndUpdate(
                { _id: ObjectId(req.params.id) },
                {
                    favourited: true
                }
            );
            console.log("Favourited");
        } catch (err) {
            console.log(err);
        }
    },
    deleteLossEvent: async (req, res) => {
        try {
            // Find post by id
            let post = await LossEvent.findById({ _id: req.params.id });
            // Delete image from cloudinary
            // Delete post from db
            await LossEvent.remove({ _id: req.params.id });
            if (post.cloudinaryId) {
                await cloudinary.uploader.destroy(post.cloudinaryId);
            }
            console.log("Deleted Post");
            res.sendStatus(200);
        } catch (err) {
            console.log(err)
            res.sendStatus(500);
        }
    },
};
