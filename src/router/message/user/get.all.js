const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

router.get("/", async (req, res, next) => {
  try {
    // check if the query has a user's id
    if (!req.query.user_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال معرف المستخدم",
          }),
          403
        )
      );
    }

    // find the user
    const user = await User.findById(req.query.user_id).populate({
      path: "messages",
    });

    // create response
    const response = {
      user_messages: user.messages,
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
