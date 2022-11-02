const express = require("express");
const router = express.Router();

const {
  getInventoryController,
  postInventoryController,
  getInventoryByIdController,
  patchInventoryController,
  deleteInventoryController,
  getInventoryPaginatedController,
} = require("../controllers/inventory");

const { protectUser } = require("../middleware/index");

// // //getting all & filter
// router.get("/", getInventoryController);

//getting one by id
router.get("/:id", getInventoryByIdController);

//creating one
router.post("/:id", protectUser, postInventoryController);

//updating one
router.patch("/:id", patchInventoryController);

//deleting one
router.delete("/:id", deleteInventoryController);

//get all paginated
router.get("/", protectUser, getInventoryPaginatedController);

module.exports = router;
