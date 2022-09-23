const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  password: {
    type: Number,
    required: true
  }
  
});