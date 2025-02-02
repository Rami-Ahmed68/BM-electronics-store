const express = require("express");
const router = express.Router();

// import valiadte ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import order model
const Order = require("../../model/order/order");

router.get("/", async (req, res, next) => {
  try {
    // check if the request has an odrer_id
    if (!req.query.order_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال معرف الطلب",
          }),
          403
        )
      );
    }

    // get to order
    const order = await Order.findById(req.query.order_id).populate([
      {
        path: "product_id",
      },
      {
        path: "order_by",
      },
    ]);

    // create response
    const response = {
      order_data: order,
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
