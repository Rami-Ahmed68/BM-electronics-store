const express = require("express");
const router = express.Router();

// import valiadte ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import order model
const Order = require("../../model/order/order");

router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page || 1;

    const limit = req.query.limit || 5;

    const skip = (page - 1) * limit;

    // get to orders
    const orders = await Order.find()
      .populate([
        {
          path: "product_id",
          select: "_id title description product_number price images",
        },
        {
          path: "order_by",
          select: "_id first_name last_name avatar",
        },
      ])
      .skip(skip)
      .limit(limit);

    // create response
    const response = {
      orders_data: orders,
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
