const Inventory = require("../models/inventories");

//Delete single inventory
const deleteInventoryController = async (req, res) => {
    try {
      const invDel = await Inventory.findById(req.params.id);
      if (invDel == null) {
        return res.status(404).json({ message: "Cannot find inventory" });
      }
      await invDel.remove();
      return res
        .status(200)
        .json({ message: "Sucessfully Deleted inventory: " + invDel.title });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  //Create new inventory
const postInventoryController = async (req, res) => {
  const inventory = new Inventory({
    title: req.body.title,
    user_id: req.body.user_id,
  });
  try {
    const newInventory = await inventory.save();
    console.log(newInventory);
    return res.status(201).send("Created new inventory successfully.");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};