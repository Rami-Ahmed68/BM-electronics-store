const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  password: {
    type: String,
    required: true,
  },
  account_type: {
    type: String,
    required: true,
    enum: ["admin", "super_admin"],
  },
  avatar: {
    type: String,
    required: false,
  },
  joind_at: {
    type: Date,
    required: true,
  },
});

const Admin = mongoose.model("admin", admin);

module.exports = Admin;
