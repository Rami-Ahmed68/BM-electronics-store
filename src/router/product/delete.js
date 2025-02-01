const express = require("express");
const router = express.Router();

// import validate ApiError
const ApiError = require("../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../model/admin/admin");

// import product model
const Product = require("../../model/product/product");

// import validate create product data method
const validate_delete_product_data = require("../../controls/middleware/validation/product/validate-delete");

// import the delete images
const delete_old_image = require("../../controls/utils/upload/delete-old-images");

// import verify token method
const verify_token = require("../../controls/utils/token/verify-token");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    validate_delete_product_data(req.body, next);

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // check if the admin can (delete)
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

    // verfiy token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin id in body is equal id in token
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ في لبيانات المرسلة",
          }),
          403
        )
      );
    }

    // find the product
    const product = await Product.findById(req.body.product_id);

    // check if the product is exists
    if (!product) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على المنتج",
          }),
          403
        )
      );
    }

    // check if the product has any image
    if (product.images.length > 0) {
      // delete the images
      for (let i = 0; i < product.images.length; i++) {
        delete_old_image(product.images[i], next);
      }
    }

    // delete the product
    await Product.deleteOne(product._id);

    // create a response
    const response = {
      message: {
        arabic: "تم الحذف بنجاح",
      },
    };

    // send the resposne to client
    res.status(200).send(response);
  } catch (error) {
    // return error
    return next(
      new ApiError(
        JSON.stringify({
          arabic: "عذرا خطا عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
