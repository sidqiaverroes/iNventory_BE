const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//Register
const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //Validation
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all the required fields.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  //Check if user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("Email has been registered.");
  }

  //Create new user
  const newUser = await User.create({
    username,
    email,
    password,
  });

  //Generate token
  const token = generateToken(newUser._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
  });

  if (newUser) {
    const { _id, username, email, photo, bio } = newUser;
    res.status(201).json({
      _id,
      username,
      email,
      photo,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

//Login
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password.");
  }

  //Check if user exist
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup.");
  }

  //User exist, check password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
  });

  if (user && passwordIsCorrect) {
    const { _id, username, email, photo, bio } = user;
    res.status(200).json({
      _id,
      username,
      email,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password.");
  }
});

//Logout
const logoutController = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
  });
  return res.status(200).json({ message: "Successfully logged out." });
});

//Get user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, username, email, photo, bio } = user;
    res.status(200).json({
      _id,
      username,
      email,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { username, email, photo, bio } = user;
    user.email = email;
    user.username = req.body.username || username;
    user.photo = req.body.photo || photo;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

//Change password
const changePassowrd = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up.");
  }

  const { oldPassword, newPassword } = req.body;
  //Validate
  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please enter old and new Password.");
  }

  //Check if old password matches password in db
  const passwordIsMatch = await bcrypt.compare(oldPassword, user.password);

  //Save new password
  if (user && passwordIsMatch) {
    user.password = newPassword;
    await user.save();
    res.status(200).send("Password changed successfully.");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect.");
  }
});

//Get user login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

//get all users data
const userList = (req, res) => {
  User.find((err, users) => {
    res.send(users);
  });
};

module.exports = {
  registerController,
  loginController,
  userList,
  logoutController,
  updateUser,
  getUser,
  changePassowrd,
  loginStatus,
};
