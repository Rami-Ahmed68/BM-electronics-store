const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import order model
const Order = require("../../model/order/order");

// import user model
const User = require("../../model/user/user");

// import validate bdy data method
const validate_update_order_data = require("../../controls/middleware/validation/order/validate-update");

// import verify token method
const verify_token = require("../../controls/utils/token/verify-token");

// import upload_order_images
const upload_order_images = require("../../controls/utils/upload/upload-odrer-images");

// import delete_old_order_images method
const delete_old_order_images = require("../../controls/utils/upload/delete-old-odrer-images");

// import delete uploaded images method
const delete_image = require("../../controls/utils/upload/delete-images");

router.put("/", upload_order_images, async (req, res, next) => {
  try {
    // validate body data
    validate_update_order_data(req.body, next);

    // check if the body has any data
    if (
      !req.body.title &&
      !req.body.count_of_products &&
      !req.body.custom_message &&
      !req.body.images_for_delete &&
      !req.files
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

    // find the user
    const user = await User.findById(req.body.user_id);

    // check if the user is eixsts
    if (!user) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم التعرف على المستخدم",
          }),
          404
        )
      );
    }

    // verify the token data
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

    // find the order
    const order = await Order.findById(req.body.order_id);

    // check if the order is exists
    if (!order) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم التعرف على الطلب",
          }),
          404
        )
      );
    }

    // find and update the order
    const updated_order = await Order.findByIdAndUpdate(
      { _id: req.body.order_id },
      {
        $set: {
          title: req.body.title ? req.body.title : order.title,
          count_of_products: req.body.count_of_products
            ? req.body.count_of_products
            : order.count_of_products,
          custom_message: req.body.custom_message
            ? req.body.custom_message
            : order.custom_message,
        },
      },
      {
        new: true,
      }
    );

    // check if the request has a images_for_delete
    const images_for_delete = req.body.images_for_delete
      ? req.body.images_for_delete.split("split_here")
      : [];

    // check if the images_for_delete's length is more than 0 (not empty)
    if (images_for_delete.length > 0) {
      // delete all images's url (for_delete)
      updated_order.images = order.images.filter(
        (url) => !images_for_delete.includes(url)
      );

      for (let i = 0; i < images_for_delete.length; i++) {
        delete_old_order_images(images_for_delete[i], next);
      }
    }

    // check if the request has any image
    if (req.files && req.files.length > 0) {
      // set the uplaoded images to created order
      for (let i = 0; i < req.files.length; i++) {
        updated_order.images.push(
          `${process.env.HOST_URL}/orders-images/${req.files[i].filename}`
        );
      }
    }

    // save the updated order
    await updated_order.save();

    // create response
    const response = {
      message: {
        arabic: "تم التعديل بنجاح",
      },
      order_data: updated_order,
    };

    //send the response to clinet
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any image
    if (req.files && req.files.length > 0) {
      // delete uploaded images
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
