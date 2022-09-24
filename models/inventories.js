const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  user_id: {
    type: Number,
    // required: true
  },
  
  item_id: {
    type: Number,
  }

});

module.exports = mongoose.model('Inventory', inventorySchema)