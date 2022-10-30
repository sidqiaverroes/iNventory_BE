const express = require("express");
const router = express.Router();

const {
  getAllItemController,
  getSingleItemController,
  postItemController,
  patchItemController,
  deleteItemController,
} = require("../controllers/item");

//get all items
router.get("/", getAllItemController);

//get items by id
router.get("/:id", getSingleItemController);

//create new item
router.post("/", postItemController);

//update item
router.patch("/:id", patchItemController);

//delete item
router.delete("/:id", deleteItemController);

module.exports = router;
