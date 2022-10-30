const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

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
    secure: true,
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
// check username exist or not
// if exist then check password is match with the corresponding email
// if match login
const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
      return res.send("username not registered");
    } else {
      if (req.body.password != user.password) {
        return res.send("password incorrect");
      } else {
        return res.send("login successfully");
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all users data
const userList = (req, res) => {
  User.find((err, users) => {
    res.send(users);
  });
};

module.exports = { registerController, loginController, userList };
