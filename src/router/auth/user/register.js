const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import the user model
const User = require("../../../model/user/user");

// import validate body data method
const validate_create_user_data = require("../../../controls/middleware/validation/user/validate-create");

// import user checks method
const checks_exists_account = require("../../../controls/utils/account-checks/account-exists");

// import hashing method
const hashing = require("../../../controls/utils/password/hashing");

// import the generate token method
const generate_token = require("../../../controls/utils/token/generate-token");

router.post("/", async (req, res, next) => {
  try {
    // validate body data
    validate_create_user_data(req.body, next);

    // check if the email is already used
    checks_exists_account("user", req.body.email, next);

    // create a new user document
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      email: req.body.email,
      password: await hashing(req.body.password),
    });

    // save the user on data base
    await user.save();

    // generate token
    const generated_token = generate_token(user._id, req.body.email);

    // createa new response
    const response = {
      message: {
        arabic: "تم إنشاء الحساب بنجاح",
        user_data: _.pick(user, [
          "_id",
          "fisrt_name",
          "last_name",
          "gender",
          "email",
        ]),
        token: generated_token,
      },
    };

    //send the response to clinte
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
