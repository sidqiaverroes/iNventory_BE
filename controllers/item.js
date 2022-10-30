const Item = require("../models/items");

const getAllItemController = async (req, res) => {
  try {
    const item = await Item.find();
    const filters = req.query;
    const filteredItem = item.filter((item) => {
      // console.log(item);
      let isValid = true;
      for (key in filters) {
        console.log(key, item[key], filters[key]);
        isValid = isValid && item[key] == filters[key];
      }
      return isValid;
    });
    res.send(filteredItem);
    // console.log(req.query);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleItemController = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: "Cannot find item" });
    }
    res.send(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

const patchItemController = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = {};
    if (req.body.name != (null || "")) {
      update.name = req.body.name;
    }
    if (req.body.category != (null || "")) {
      update.category = req.body.category;
    }
    if (req.body.qty != (null || "")) {
      update.qty = req.body.qty;
    }
    if (req.body.inventory_id != (null || "")) {
      update.inventory_id = req.body.inventory_id;
    }
    console.log(update);

    let updated = await Item.findOneAndUpdate(filter, update, { new: true });
    console.log(updated);
    res.send("Item updated successfully.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const getItemsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort;
    // let category = req.query.category || "ALL"

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const items = await Item.find({
      name: { $regex: search, $options: "i" },
    })
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await items.countDocuments({});

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      itmes,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItemController,
  getSingleItemController,
  postItemController,
  patchItemController,
  deleteItemController,
  getItemsController,
};
