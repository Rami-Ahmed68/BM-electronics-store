const mongoose = require("mongoose");

const user = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  avatar: {
    type: String,
    required: false,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
  ],
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joind_adt: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("user", user);

module.exports = User;
