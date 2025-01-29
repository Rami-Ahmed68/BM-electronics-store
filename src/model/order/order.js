const mongoose = require("mongoose");

const order = new mongoose.Schwema({
  title: {
    type: String,
    required: true,
  },
  product_id: {
    type: mongoose.Types.Schema.ObjectId,
    ref: "product ",
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
    type: mongoose.Types.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("order", order);

module.exports = Order;
