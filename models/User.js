const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT =  require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
       
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword
    next();
  
});

userSchema.method("generateToken", function () {
    const token = JWT.sign(
        {
            userId: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
    return token
});

const User = mongoose.model("User", userSchema);

module.exports = { User };