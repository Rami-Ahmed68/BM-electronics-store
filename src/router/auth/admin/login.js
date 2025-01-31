const express = require("express");
const router = express.Router();
const _ = require("lodash");
// import validate api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import validate login body data method
const validate_login_admin_data = require("../../../controls/middleware/validation/admin/validate-login");

// import compare the passwor method
const compare = require("../../../controls/utils/password/compaering");

// import generate token method
const generate_token = require("../../../controls/utils/token/generate-token");

// import limiting of login
const login_limit = require("../../../controls/utils/limit/admin/login");

router.post("/", login_limit, async (req, res, next) => {
  try {
    // validte body data
    validate_login_admin_data(req.body);

    // find the admin
    const admin = await Admin.findOne({ email: req.body.email });

    // check if the admin is exists
    if (!admin) {
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ في الإيميل او كلمة المرور",
          }),
          404
        )
      );
    }

    // compare the password
    await compare(admin.password, req.body.password, next);

    // generate a token
    const generated_token = generate_token(admin._id, admin.email);

    // create a response
    const response = {
      message: {
        arabic: "تم تسجيل الدخول بنجاح",
      },
      admin_data: _.pick(admin, ["_id", "name", "avatar", "email"]),
      token: generated_token,
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
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
