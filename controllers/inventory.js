const Inventory = require("../models/inventories");
// const paginatedResults = require("../middleware/index");

//get all inventory and filtering
const getInventoryController = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    const filters = req.query;
    const filteredInventories = inventory.filter((item) => {
      // console.log(item);
      let isValid = true;
      for (key in filters) {
        console.log(key, item[key], filters[key]);
        isValid = isValid && item[key] == filters[key];
      }
      return isValid;
    });
    res.send(filteredInventories);
    // console.log(req.query);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get single inventory
const getInventoryByIdController = async (req, res) => {
  let inventory;
  try {
    inventory = await Inventory.findById(req.params.id);
    console.log(req.params.id);
    if (inventory == null) {
      res.status(404).json({ message: "Cannot find inventory" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.json(inventory);
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all paginated
const getInventoryPaginatedController = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Inventory.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  try {
    let sortBy = {};
    if (req.query.sort)
      results.results = await Inventory.find()
        .limit(limit)
        .skip(startIndex)
        .sort({ title: 1 })
        .exec();
    res.paginatedResults = results;
    console.log(results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete all inventories
// const deleteAllInventoriesController = (req, res) => {
//   Inventory.deleteMany((err) => {
//     if (!err) {
//       res.send("Sucessfully deleted all inventories.");
//     } else {
//       res.send(err);
//     }
//   });
// };

module.exports = {
  getInventoryController,
  postInventoryController,
  getInventoryByIdController,
  patchInventoryController,
  deleteInventoryController,
  getInventoryPaginatedController,
};
