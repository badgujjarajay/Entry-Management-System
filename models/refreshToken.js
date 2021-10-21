const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email number is not valid."]
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Refresh Token', refreshTokenSchema);