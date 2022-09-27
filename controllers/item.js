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

  const postItemController = async (req, res) => {
    try {
      const item = new Item({
        name: req.body.name,
        category: req.body.category,
        qty: req.body.qty,
        inventory_id: req.body.inventory_id,
      });
      const newItem = await item.save();
      console.log(newItem);
      res.status(201).send("Created new item successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };