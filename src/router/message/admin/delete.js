const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import user model
const User = require("../../../model/user/user");

// import message model
const Message = require("../../../model/message/message");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// import validate body data method
const validate_delete_message_data = require("../../../controls/middleware/validation/message/admin/validate-delete");

// import delete message''s images method
const delete_old_message_image = require("../../../controls/utils/upload/delete-old-message-images");

router.post("/", async (req, res, next) => {
  try {
    // validate body data
    validate_delete_message_data(req.body, next);

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the use is exists
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم التعرف على بيانات الأدمن",
          }),
          404
        )
      );
    }

    // verify token data
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
            arabic: "عذرا خطأ في البيانات المرسلة",
          }),
          403
        )
      );
    }

    // find the message
    const message = await Message.findById(req.body.message_id);

    // check if the message is exists
    if (!message) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الرسالة",
          }),
          404
        )
      );
    }

    // find the user
    const user = await User.findById(req.body.user_id);

    // check if the use is exists
    if (!user) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم التعرف على بيانات المستخدم",
          }),
          404
        )
      );
    }

    // delete the message's images
    if (message.images.length > 0) {
      for (let i = 0; i < message.images.length; i++) {
        delete_old_message_image(message.images[i], next);
      }
    }

    // delete the message's id of user's messages array
    user.messages = user.messages.filter((id) => id != req.body.message_id);

    // delete the message's id of admin's messages array
    admin.messages = admin.messages.filter((id) => id != req.body.message_id);

    // save the admin
    await admin.save();

    // save the user
    await user.save();

    // deleet teh message
    await Message.deleteOne(message._id);

    // create response
    const response = {
      message: {
        arabic: "تم الحذف بنجاح",
      },
    };

    // send the response to clinet
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
