const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  userList,
} = require("../controllers/user");

router.get("/", userList);
router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
