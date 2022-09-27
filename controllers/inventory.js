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