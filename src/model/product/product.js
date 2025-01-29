const mongosoe = require("mongoose");

const product = new mongosoe.Schema({
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
  created_at: {
    type: Date,
    required: true,
  },
});

const Product = mongosoe.model("product", product);

module.exports = Product;
