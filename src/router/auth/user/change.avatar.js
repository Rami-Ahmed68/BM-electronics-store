const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

// import delete image method
const delete_image = require("../../../controls/utils/upload/delete-images");

// import validate change avatar method
const validate_change_user_avatar = require("../../../controls/middleware/validation/user/validate-change-cover");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// import upload_avatar method
const upload_avatar = require("../../../controls/utils/upload/upload-admin-avatar");

// import delete old avatar method
const delete_old_avatar = require("../../../controls/utils/upload/delete-old-avatar");

router.put("/", upload_avatar, async (req, res, next) => {
  try {
    // validate body data
    validate_change_user_avatar(req.body, next);

    // find the user
    const user = await User.findById(req.body.user_id);

    // check if the user is eixsts
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

    // verify the token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the user's id in token is equal id in body
    if (verify_token_data._id != req.body.user_id) {
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
      delete_old_avatar(user.avatar, next);

      // set a new avatar
      user.avatar =
        user.gender == "male"
          ? process.env.DEFAULT_MALE_AVATAR
          : process.env.DEFAULT_FEMALE_AVATAR;
    } else {
      // delete the old avatar
      delete_old_avatar(user.avatar, next);

      // set the avatar to the user
      user.avatar = `${process.env.HOST_URL}/avatars/${req.files[0].filename}`;
    }

    await user.save();

    // create response
    const response = {
      message: {
        arabic: "تم التعديل بنجاح",
        new_avatar: user.avatar,
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
