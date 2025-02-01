const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

router.get("/", async (req, res, next) => {
  try {
    // check if the reuest has a user id or not
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

    // get to the user
    const user = await User.findById(req.query.user_id);

    // craete resposne
    const response = {
      user_data: _.pick(user, [
        "_id",
        "first_name",
        "last_name",
        "gender",
        "avatar",
        "joind_at",
      ]),
    };

    // send the response to clint
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
