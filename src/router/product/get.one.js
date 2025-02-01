const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError
const ApiError = require("../../controls/utils/error/ApiError");

// import product model
const Product = require("../../model/product/product");

router.get("/", async (req, res, next) => {
  try {
    // check if the request has a product id
    if (!req.query.product_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال معرف المنتج",
          }),
          403
        )
      );
    }

    // find the product by id
    const product = await Product.findById(req.query.product_id).populate({
      path: "created_by",
      select: "_id name avatar",
    });

    // create resposne
    const resposne = {
      product_data: _.pick(product, [
        "_id",
        "title",
        "description",
        "images",
        "count",
        "price",
        "brand",
        "tags",
        "product_number",
        "created_by",
        "created_at",
      ]),
    };

    //send the resposne
    res.status(200).send(resposne);
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
