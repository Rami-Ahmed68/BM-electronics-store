const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import Order model
const Order = require("../../../model/order/order");

// import verify delete order images
const delete_old_image = require("../../../controls/utils/upload/delete-old-odrer-images");

// import validate body data method
const validate_delete_order_data = require("../../../controls/middleware/validation/order/validate-admin-delete");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

// import the user model
const User = require("../../../model/user/user");

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

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is eixsts
    if (!admin) {
      // retur error
      return enxt(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // check if the admin can delete
    if (admin.account_type == "admin") {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا ليس لديك صلاحيات السوبر ادمن",
          }),
          403
        )
      );
    }

    // verify the token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin id in token is equal id in body
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

    // check if the order's images is not empty
    if (order.images.length > 0) {
      // delete the order's images
      for (let i = 0; i < order.images.length; i++) {
        // delete the images
        delete_old_image(order.images[i], next);
      }
    }

    // find the user
    const user = await User.findById(order.order_by);

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
