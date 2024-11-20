const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    loginType: {
        type: String,
        default: "email"    // email, google, github, ....s
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)