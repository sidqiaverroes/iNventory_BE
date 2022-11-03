const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  userList,
  logoutController,
  getUser,
  updateUser,
  changePassowrd,
  loginStatus,
} = require("../controllers/user");

const { protectUser } = require("../middleware/index");

router.get("/", userList);
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.get("/getuser", protectUser, getUser);
router.patch("/updateuser", protectUser, updateUser);
router.patch("/changepassword", protectUser, changePassowrd);
router.get("/loginstatus", loginStatus);

module.exports = router;
