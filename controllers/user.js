const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokens");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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

//Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  //Delete token if it exist in db
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  //create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  //Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Save token to db
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiredAt: Date.now() + 30 * 60 * 1000, //30 minutes
  }).save();

  //Construct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //Reset Email
  const message = `
    <h2>Hello ${user.username} </h2>
    <p>Plese use the url below to reset your password.</p> 
    <p>This reset link is valid for only 30 minutes.</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards, iNventory Team.</p>
  `;

  const subject = "iNventory Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset email sent." });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again.");
  }
});

//Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const { resetToken } = req.params;

  //Hash token then compare with token in db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //find token in db
  const userToken = await Token.findOne({
    token: hashedToken,
    expiredAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token.");
  }

  //Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = newPassword;
  await user.save();
  res.status(200).json({ message: "Password reset successful, please login." });
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
  forgotPassword,
  resetPassword,
};
