const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String
  },
  
  qty: {
    type: Number
  },
  
  date: {
    type: Date
  }

});