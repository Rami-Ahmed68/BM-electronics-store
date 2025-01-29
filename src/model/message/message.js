const mongoose = require("mongoose");

const message = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  message_to: {
    type: mongoose.Types.Schema.ObjectId,
    required: false,
    ref: "user",
  },
  created_by_type: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  created_by: {
    type: String,
    refPath: "created_by_type",
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("message", message);

module.exports = Message;
