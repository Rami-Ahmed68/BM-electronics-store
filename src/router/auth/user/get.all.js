const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page || 1;

    const limit = req.query.limit || 5;

    const skip = (page - 1) * limit;

    // get to the users
    const users = await User.find().skip(skip).limit(limit).sort({ _id: -1 });

    // craete resposne
    const response = {
      users_data: users.map((user) =>
        _.pick(user, [
          "_id",
          "first_name",
          "last_name",
          "gender",
          "avatar",
          "joind_at",
        ])
      ),
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
