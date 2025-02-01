const express = require("express");
const router = express.Router();
const _ = require("lodash");

// imort validate ApiError
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

// import generate token method
const generate_token = require("../../../controls/utils/token/generate-token");

// import validate login data method
const validate_login_user_data = require("../../../controls/middleware/validation/user/validate-login");

// import compare passwords method
const compare = require("../../../controls/utils/password/compaering");

// import limiting of login
const login_limit = require("../../../controls/utils/limit/user/login");

router.post("/", login_limit, async (req, res, next) => {
  try {
    // validate body data
    validate_login_user_data(req.body, next);

    // find the user by admin
    const user = await User.findOne({ email: req.body.email });

    // check if the useris exists
    if (!user) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ في الحساب او كلمة المرور",
          }),
          404
        )
      );
    }

    // compare the password
    const compared = await compare(req.body.password, user.password);

    // check if the comparing is true or note
    if (!compared) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذار خطأ في الإيميل او كلمة المرور",
          }),
          403
        )
      );
    }

    // generate token
    const generated_token = generate_token(user._id, user.email);

    // create response
    const response = {
      message: {
        arabic: "تم تسجيل الدخول بنجاح",
        user_data: _.pick(user, ["_id", "first_name", "last_name", "avatar"]),
        token: generated_token,
      },
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
