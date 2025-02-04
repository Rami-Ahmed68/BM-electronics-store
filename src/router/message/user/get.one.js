const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import message model
const Message = require("../../../model/message/message");

router.get("/", async (req, res, next) => {
  try {
    // check if the query has a message's id
    if (!req.query.message_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال معرف الرسالة",
          }),
          403
        )
      );
    }

    // find the message
    const message = await Message.findById(req.query.message_id).populate(
      {
        path: "message_to",
        select: "_id first_name last_name avatar",
      },
      {
        path: "created_by",
        select: "_id first_name last_name avatar",
      }
    );

    // create response
    const response = {
      message_data: message,
    };

    // send teh response to clinet
    res.status(200).send(response);
  } catch (error) {
    // return error
    return next(
      new ApiError(
        JSON.stringify({
          arabic: "عذرا خطأ عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
