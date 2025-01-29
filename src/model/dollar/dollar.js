const mongoose = require("mongoose");

const dollar = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  last_update: {
    type: Date,
    required: true,
  },
});

const Dollar = mongoose.model("dollar", dollar);

module.exports = Dollar;
