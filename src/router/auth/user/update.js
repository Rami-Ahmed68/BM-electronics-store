const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate APiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

// import verify token method
const verfiy_token = require("../../../controls/utils/token/verify-token");

// import validate body data method
const validate_update_user_data = require("../../../controls/middleware/validation/user/validate-update");

// import hashing password method
const hashing_password = require("../../../controls/utils/password/hashing");

router.put("/", async (req, res, next) => {
  try {
    console.log(req.body.password);
    // check if the request has any new data
    if (!req.body.first_name && !req.body.last_name && !req.body.password) {
      // returtn error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال بيانات  للتعديل",
          }),
          403
        )
      );
    }

    // validate body data
    validate_update_user_data(req.body, next);

    // find the user by id
    const user = await User.findById(req.body.user_id);

    // check if the user is exists
    if (!user) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على المستخدم",
          }),
          404
        )
      );
    }

    // verify token data
    const verify_token_data = await verfiy_token(
      req.headers.authorization,
      next
    );

    // check if the user's id in body is equal id in token
    if (verify_token_data._id != req.body.user_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ في بيانات المستخدم",
          }),
          403
        )
      );
    }

    // update the user
    const updated_user = await User.findByIdAndUpdate(
      { _id: req.body.user_id },
      {
        $set: {
          first_name: req.body.first_name
            ? req.body.first_name
            : user.first_name,
          last_name: req.body.last_name ? req.body.last_name : user.last_name,
          password: req.body.password
            ? await hashing_password(req.body.password)
            : user.password,
        },
      },
      { new: true }
    );

    // save the user after updated
    await updated_user.save();

    // craete a aresponse
    const response = {
      mesage: {
        arabic: "تم التعديل بنجاح",
        user_data: _.pick(updated_user, [
          "_id",
          "first_name",
          "last_name",
          "gender",
          "avatar",
          "email",
        ]),
      },
    };

    // send the response to clinte
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
