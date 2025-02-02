const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import user model
const User = require("../../model/user/user");

// import Order model
const Order = require("../../model/order/order");

// import verify delete order images
const delete_old_image = require("../../controls/utils/upload/delete-old-odrer-images");

// import validate body data method
const validate_delete_order_data = require("../../controls/middleware/validation/order/validate-delete");

// import verify token method
const verify_token = require("../../controls/utils/token/verify-token");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    validate_delete_order_data(req.body, next);

    // find the order
    const order = await Order.findById(req.body.order_id);

    // check if the order is exists
    if (!order) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الطلب",
          }),
          404
        )
      );
    }

    // find teh user
    const user = await User.findById(req.body.user_id);

    // check if the user is eixsts
    if (!user) {
      // retur error
      return enxt(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على المستخدم",
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

    // check if the user id in token is equal id in body
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

    // check if the order's images is not empty
    if (order.images.length > 0) {
      // delete the order's images
      for (let i = 0; i < order.images.length; i++) {
        // delete the images
        delete_old_image(order.images[i], next);
      }
    }

    // delete the order's id of the user's orders array
    user.orders = user.orders.filter((id) => id != req.body.order_id);

    // save the user afetr delete the order's id
    await user.save();

    // delete the order
    await Order.deleteOne(order._id);

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
