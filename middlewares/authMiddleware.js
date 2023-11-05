const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ErrorResponse(
        "You're not allowed to access to this page!",
        401
      )
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.log("error: ", error);
    return next(
      new ErrorResponse(
        "You're not allowed to access to this page!",
        401
      )
    );
  }
};

exports.authorize = (...role) => {
  return (req, res, next) => {
    if (role === req.user.role) {
      return next(
        new ErrorResponse(
          "Access Forbidden!",
          403
        )
      );
    }
    next();
  };
};