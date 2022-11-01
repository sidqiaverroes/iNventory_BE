const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const protectUser = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login.");
    }

    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //Get user data by id from token without password
    let user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = { errorHandler, protectUser };
