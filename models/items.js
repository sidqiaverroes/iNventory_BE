const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
  },

  price: {
    type: String,
  },

  qty: {
    type: Number,
  },

  inventory_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Item", itemSchema);
