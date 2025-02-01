const mongoose = require("mongoose");

const product = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    required: true,
  },
  product_number: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "admin",
  },
  created_at: {
    type: Date,
    required: true,
  },
});

const Product = mongoose.model("product", product);

module.exports = Product;
