const express = require("express");
const router = express.Router();

const {
  getAllItemController,
  getSingleItemController,
  postItemController,
  patchItemController,
  deleteItemController,
  getItemsController,
} = require("../controllers/item");

//get all items
// router.get("/", getAllItemController);

//get items by id
router.get("/details/:id", getSingleItemController);

//create new item
router.post("/:id", postItemController);

//update item
router.patch("/:id", patchItemController);

//delete item
router.delete("/:id", deleteItemController);

router.get("/:id", getItemsController);

module.exports = router;
