const mongoose = require("mongoose");

const LossEventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        require: false,
    },
    cloudinaryId: {
        type: String,
        require: false,
    },
    description: {
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps: true});

module.exports = mongoose.model("LossEvent", LossEventSchema);