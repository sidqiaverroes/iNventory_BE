const express = require("express");
const router = express.Router();

const {
  getInventoryController,
  postInventoryController,
  getSingleInventoryController,
  patchInventoryController,
  deleteInventoryController,
} = require("../controllers/inventory");

//getting all & filter
router.get("/", getInventoryController);

//getting one by id
router.get("/:id", getSingleInventoryController);

//creating one
router.post("/", postInventoryController);

//updating one
router.patch("/:id", patchInventoryController);

//deleting one
router.delete("/:id", deleteInventoryController);

module.exports = router;
