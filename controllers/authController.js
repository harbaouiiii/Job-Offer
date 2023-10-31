const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    user.password = undefined;
    res.status(statusCode).json({ user, token });
};

exports.register = async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      role,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !dateOfBirth ||
      !role
    ) {
      return next(
        new ErrorResponse("All fields are required!", 400)
      );
    }
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return next(
        new ErrorResponse(
          "User already exists. Please login!",
          401
        )
      );
    }
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        role,
    });
    sendTokenResponse(user, 200, res);
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorResponse("Please enter your email and password!", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(
        new ErrorResponse(
          "Wrong email!",
          401
        )
      );
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(
        new ErrorResponse(
          "Wrong password!",
          401
        )
      );
    }
  
    sendTokenResponse(user, 200, res);
};

exports.logout = async (req, res) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 1000),
      http_only: true,
    });
    res.status(200).json({ success: true });
};