const Inventory = require("../models/inventories");

//Update inventory
const patchInventoryController = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;
    console.log(req.body);

    let updated = await Inventory.findOneAndUpdate(filter, update, {
      new: true,
    });
    console.log(updated);
    res.send("Successfully updated inventory");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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