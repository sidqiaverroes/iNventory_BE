const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: string,
    required: true,
    minlength: 6,
  },
});

module.exports = mongoose.model("User", userSchema);
