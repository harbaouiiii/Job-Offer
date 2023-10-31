const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Firstname is required!'],
        trim: true,
        minlength: [3, 'Minimum length is 3 caracters!']
    },
    lastName: {
        type: String,
        required: [true, 'Lastname is required!'],
        trim: true,
        minlength: [3, 'Minimum length is 3 caracters!']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'Email is already in use!'],
        required: [true, 'Email is required!'],
        validate: [isEmail, 'Please enter a valid email!'],
    },
    role: {
        type: String,
        enum: ["RECRUTER", "CANDIDATE", "ADMIN"],
        default: "CANDIDATE",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Minimum length is 8!"],
        select: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    applications: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetEmailToken: String,
    resetEmailExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
    const payload = {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.matchEmail = async function (enteredEmail) {
    return this.email === enteredEmail;
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

userSchema.methods.getResetEmailToken = function () {
    const resetToken = crypto.randomBytes(21).toString("hex");
    this.resetEmailToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetEmailExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model("User", userSchema);