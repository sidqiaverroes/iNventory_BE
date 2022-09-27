const Item = require("../models/items");

//Deleting
const deleteItemController = async (req, res) => {
    try {
      const itemDel = await Item.findById(req.params.id);
      if (itemDel == null) {
        return res.status(404).json({ message: "Cannot find item" });
      }
      await itemDel.remove();
      return res
        .status(200)
        .json({ message: "Sucessfully Deleted item: " + itemDel.name });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };