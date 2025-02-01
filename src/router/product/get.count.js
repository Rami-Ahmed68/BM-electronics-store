const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError
const ApiError = require("../../controls/utils/error/ApiError");

// import product model
const Product = require("../../model/product/product");

router.get("/", async (req, res, next) => {
  try {
    // get to all products dount
    const product_count = await Product.countDocuments({});

    // create resposne
    const resposne = {
      product_count: product_count,
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
