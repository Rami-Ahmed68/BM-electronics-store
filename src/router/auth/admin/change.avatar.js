const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import delete image method
const delete_image = require("../../../controls/utils/upload/delete-images");

// import validate change avatar method
const validate_change_admin_avatar = require("../../../controls/middleware/validation/admin/validate-update");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// import upload_avatar method
const upload_avatar = require("../../../controls/utils/upload/upload-admin-avatar");

// import delete old avatar method
const delete_old_avatar = require("../../../controls/utils/upload/delete-old-avatar");

router.put("/", upload_avatar, async (req, res, next) => {
  try {
    // validate body data
    validate_change_admin_avatar(req.body, next);

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is eixsts
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // verify the token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token is equal id in body
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ  في البيانات المرسلة",
          }),
          400
        )
      );
    }

    // check if the avatar's reaction
    if (req.body.avatar_reaction == "delete") {
      // delete the uploaded image
      delete_image(req.files, next);

      // check if the requets has a files or not
      if (req.files && req.files.length > 0) {
        // retuen error
        return next(
          new ApiError(
            JSON.stringify({
              arabic: "غير ممكن رفع اي صورة جديدة",
            }),
            403
          )
        );
      }

      // delete the old avatar
      delete_old_avatar(admin.avatar, next);

      // set a new avatar
      admin.avatar =
        admin.gender == "male"
          ? process.env.DEFAULT_MALE_AVATAR
          : process.env.DEFAULT_FEMALE_AVATAR;
    } else {
      // delete the old avatar
      delete_old_avatar(admin.avatar, next);

      // set the avatar to the admin
      admin.avatar = `${process.env.HOST_URL}/avatars/${req.files[0].filename}`;
    }

    await admin.save();

    // create response
    const response = {
      message: {
        arabic: "تم التعديل بنجاح",
        new_avatar: admin.avatar,
      },
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    if (req.files) {
      delete_image(req.files, next);
    }

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
