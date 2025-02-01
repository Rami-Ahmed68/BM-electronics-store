const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import user modle
const User = require("../../../model/user/user");

// import admin model
const Admin = require("../../../model/admin/admin");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// impodelete_old_avatar method
const delete_old_avatar = require("../../../controls/utils/upload/delete-old-avatar");

// import validate body data method
const validate_delete_user_data = require("../../../controls/middleware/validation/user/validate-delete");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    validate_delete_user_data(req.body, next);

    // fin dthe user by id
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

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return errro
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // check if the admin is a super admin or not
    if (admin.account_type != "super_admin") {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا ليس لديك صلاحيات السوبر أدمن",
          }),
          403
        )
      );
    }

    // verify token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin 'is in token is equal id in body
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ في البيانات المرسلة",
          }),
          403
        )
      );
    }

    // check if the user has a avatar
    if (user.avatar && user.avatar != "") {
      // delete the user's avatar
      delete_old_avatar(user.avatar, next);
    }

    // delete the user
    await User.deleteOne(user._id);

    // craete response
    const response = {
      message: {
        arabic: "تم حذف المستخدم بنجاح",
      },
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    // return error
    return next(
      new ApiError(
        JSON.stringify({
          arabic: "عذرا خطأ عاك",
        }),
        500
      )
    );
  }
});

module.exports = router;
