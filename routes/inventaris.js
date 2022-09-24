const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventories");

//getting all & filter
router.get("/", async (req, res) => {
  try {
    const inventory = await Inventory.find();
    const filters = req.query;
    const filteredInventories = inventory.filter((item) => {
      console.log(item);
      let isValid = true;
      for (key in filters) {
        console.log(key, item.key, filters.key);
        isValid = isValid && item.key == filter.key;
      }
      return isValid;
    });
    res.send(filteredInventories);
    console.log(req.query);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
router.get("/:id", getInventory, (req, res) => {
  // res.send(res.inventory.title)
  res.json(res.inventory);
});

//creating one
router.post("/", async (req, res) => {
  const inventory = new Inventory({
    title: req.body.title,
    user_id: req.body.user_id,
    item_id: req.body.item_id,
  });
  try {
    const newInventory = await inventory.save();
    res.status(201).json(newInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//updating one
router.patch("/:id", getInventory, async (req, res) => {
  if (req.body.title != null) {
    res.inventory.title = req.body.title;
  }
  if (req.body.user_id != null) {
    res.inventory.user_id = req.body.user_id;
  }
  if (req.body.item_id != null) {
    res.inventory.item_id = req.body.item_id;
  }

  try {
    const updatedInventory = await res.inventory.save();
    res.json(updatedInventory);
    // console.log(req.body)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//deleting one
router.delete("/:id", getInventory, async (req, res) => {
  try {
    await res.inventory.remove();
    res.json({ message: "Deleted inventory" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getInventory(req, res, next) {
  let inventory;
  try {
    inventory = await Inventory.findById(req.params.id);
    if (inventory == null) {
      return res.status(404).json({ message: "Cannot find inventory" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.inventory = inventory;
  next();
}

module.exports = router;
