const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import velidate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import user model
const User = require("../../model/user/user");

// import order model
const Order = require("../../model/order/order");

// import verify token method
const verify_token = require("../../controls/utils/token/verify-token");

// import validate body data method
const validate_create_order_data = require("../../controls/middleware/validation/order/validate-create");

// import delete images method
const delete_image = require("../../controls/utils/upload/delete-images");

// import upload order images
const upload_order_images = require("../../controls/utils/upload/upload-odrer-images");

router.post("/", upload_order_images, async (req, res, next) => {
  try {
    // validate body data
    validate_create_order_data(req.body, next);

    // find the user by his id
    const user = await User.findById(req.body.user_id);

    // check if the user is exists
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

    // check if the user id in token is equla id in body
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

    // craete the order
    const order = new Order({
      title: req.body.title,
      count_of_products: req.body.count_of_products,
      images: [],
      custom_message: req.body.custom_message,
      product_id: req.body.product_id,
      order_by: req.body.user_id,
      created_at: new Date(),
    });

    // add the craeted order's id to user's orders array
    user.orders.push(order._id);

    // save the user after added the order id
    await user.save();

    // check if the request has any image
    if (req.files && req.files.length > 0) {
      // set the uplaoded images to created order
      for (let i = 0; i < req.files.length; i++) {
        order.images.push(
          `${process.env.HOST_URL}/orders-images/${req.files[i].filename}`
        );
      }
    }

    // save the created order
    await order.save();

    // craete response
    const response = {
      message: {
        arabic: "تم إرسال الطلب بنجاح",
      },
      order_data: _.pick(order, [
        "_id",
        "title",
        "images",
        "count_of_products",
        "custom_message",
        "product_id",
        "order_by",
        "created_at",
      ]),
    };

    // send teh response to clinet
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any image
    if (req.files && req.files.length > 0) {
      // delete the uploaded images
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
