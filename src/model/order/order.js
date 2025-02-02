const mongoose = require("mongoose");

const order = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  count_of_products: {
    type: Number,
  },
  images: [
    {
      type: String,
    },
  ],
  custom_message: {
    type: String,
    required: false,
  },
  order_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

const Order = mongoose.model("order", order);

module.exports = Order;
