const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a username."],
    },

    email: {
      type: String,
      required: [true, "Please enter an email."],
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email.",
      ],
    },

    password: {
      type: String,
      required: [true, "Please enter a password."],
      minlength: [6, "Password must be up to 6 characters"],
    },

    photo: {
      type: String,
      required: [true, "Please add a photo."],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },

    bio: {
      type: String,
      maxlength: [250, "Bio must not be more than 250 characters."],
      default: "bio",
    },
  },
  {
    timestamps: true,
  }
);

//Encrypt password before save to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("User", userSchema);
