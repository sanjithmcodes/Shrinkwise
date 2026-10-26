const cloudinary = require("../middleware/cloudinary");
const LossEvent = require("../models/LossEvent");

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
    createLossEvent: async (req, res) => {
        try {
            const eventData = {
                type: req.body.type,
                category: req.body.category,
                description: req.body.description,
                date: req.body.date,
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
    deleteLossEvent: async (req, res) => {
        try {
            // Find post by id, only if it belongs to the requesting user
            let post = await LossEvent.findOne({ _id: req.params.id, user: req.user.id });
            if (!post) {
                return res.sendStatus(404);
            }
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
