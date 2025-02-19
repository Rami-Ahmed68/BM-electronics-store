const express = require("express");
const router = express.Router();

// import validate ApiError
const ApiError = require("../../controls/utils/error/ApiError");

// import product model
const Product = require("../../model/product/product");

router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page || 1;

    const limit = req.query.limit || 5;

    const skip = (page - 1) * limit;

    // covert the tags array
    let tags_array = req.query.tags ? req.query.tags.split("split_here") : [];

    let brand_name = req.query.brand || "";

    // find the products by id
    const products = await Product.find({
      $or: [
        {
          tags: {
            $in: tags_array,
          },
        },
        { brand: brand_name },
      ],
    })
      .populate({
        path: "created_by",
        select: "_id name avatar",
      })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    // create resposne
    const resposne = {
      products_data: products,
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
