const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import message model
const Message = require("../../../model/message/message");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// import validate body data method
const validate_update_message_data = require("../../../controls/middleware/validation/message/admin/validate-update");

// import upload images method
const upload_message_images = require("../../../controls/utils/upload/upload-message-images");

// import delete old message images
const delete_old_message_image = require("../../../controls/utils/upload/delete-old-message-images");

// import delete uplaoded images method
const delete_image = require("../../../controls/utils/upload/delete-images");

router.put("/", upload_message_images, async (req, res, next) => {
  try {
    // check if the body has not any data
    if (
      !req.body.title &&
      !req.body.custom_message &&
      !req.files &&
      !req.body.images_for_delete
    ) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال بيانات للتعديل",
          }),
          403
        )
      );
    }

    // validate body data
    validate_update_message_data(req.body, next);

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

    // check if the admin can edait
    if (admin.account_type == "user") {
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
            arabic: "عذرا لم يتم إيجاد الرسالة",
          }),
          404
        )
      );
    }

    // update the message
    const updated_message = await Message.findByIdAndUpdate(
      { _id: req.body.message_id },
      {
        $set: {
          title: req.body.title ? req.body.title : message.title,
          custom_message: req.body.custom_message
            ? req.body.custom_message
            : message.custom_message,
        },
      },
      { new: true }
    );

    // check if teh request has any image
    if (req.files && req.files.length > 0) {
      // set the uplaoded images to updated message
      for (let i = 0; i < req.files.length; i++) {
        updated_message.images.push(
          `${process.env.HOST_URL}/messages-images/${req.files[i].filename}`
        );
      }
    }

    // cplsiting the images_for_delete
    const images_for_delete_array = req.body.images_for_delete
      ? req.body.images_for_delete.split("split_here")
      : [];

    // check if the images_for_delete's length is more than 0 (not empty)
    if (images_for_delete_array.length > 0) {
      // delete all images's url (for_delete)
      updated_message.images = message.images.filter(
        (url) => !images_for_delete_array.includes(url)
      );

      for (let i = 0; i < images_for_delete_array.length; i++) {
        delete_old_message_image(images_for_delete_array[i], next);
      }
    }

    // check if the request has any image
    if (req.files && req.files.length > 0) {
      // set the uplaoded images to created order
      for (let i = 0; i < req.files.length; i++) {
        updated_message.images.push(
          `${process.env.HOST_URL}/orders-images/${req.files[i].filename}`
        );
      }
    }

    // save the message
    await updated_message.save();

    // create response
    const response = {
      message: {
        arabic: "تم التعديل بنجاح",
      },
      message_data: updated_message,
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
