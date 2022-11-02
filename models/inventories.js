const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
