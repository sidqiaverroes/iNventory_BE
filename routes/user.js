const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  userList,
  logoutController,
  getUser,
} = require("../controllers/user");

const { protectUser } = require("../middleware/index");

router.get("/", userList);
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.get("/getuser", protectUser, getUser);

module.exports = router;
