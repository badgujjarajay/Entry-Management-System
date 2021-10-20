const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        min: [3, "Name should have at least 3 charaters."],
        max: [20, "Name should have at most 20 charaters."],
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
        match: [/^\d{10}$/, "Phone number is not valid."]
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email number is not valid."]
    },
    address: {
        type: String,
        required: true,
        trim: true,
        min: [5, "Address is too short (Should have at least 5 characters)."]
    },
    visitor_count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Host", hostSchema);