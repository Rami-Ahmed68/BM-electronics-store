const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import user model
const User = require("../../../model/user/user");

// import message model
const Message = require("../../../model/message/message");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// import validate body data method
const validate_create_message_data = require("../../../controls/middleware/validation/message/user/validate-create");

// import upload images method
const upload_message_images = require("../../../controls/utils/upload/upload-message-images");

// import delete uplaoded images method
const delete_image = require("../../../controls/utils/upload/delete-images");

router.post("/", upload_message_images, async (req, res, next) => {
  try {
    // validate body data
    validate_create_message_data(req.body, next);

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

    // verify token data
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
            arabic: "عذرا خطأ في البيانات المرسلة",
          }),
          403
        )
      );
    }

    // find the send_to_user
    const send_to_user = await User.findById(req.body.send_to);

    // check if the send_to_user is exists
    if (!send_to_user) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم التعرف على حساب مستقبل الرسالة",
          }),
          404
        )
      );
    }

    // craete the message
    const message = new Message({
      title: req.body.title,
      message_to: req.body.send_to,
      custom_message: req.body.custom_message,
      created_by_type: "user",
      created_by: req.body.user_id,
    });

    // check if teh request has any image
    if (req.files && req.files.length > 0) {
      // set the uplaoded images to created message
      for (let i = 0; i < req.files.length; i++) {
        message.images.push(
          `${process.env.HOST_URL}/messages-images/${req.files[i].filename}`
        );
      }
    }

    // add the created message's id to send_to_user's messages array
    send_to_user.messages.push(message._id);

    // save the send_to_user
    await send_to_user.save();

    // add the created'e message id to
    user.messages.push(message._id);

    // save the user
    await user.save();

    // save the message
    await message.save();

    // create response
    const response = {
      message: {
        arabic: "تم الإرسال بنجاح",
      },
      message_data: message,
    };

    // send the response to clinet
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any image
    if (req.files && req.files.length > 0) {
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
