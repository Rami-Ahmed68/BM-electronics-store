const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../model/admin/admin");

// import product model
const Product = require("../../model/product/product");

// import validate body data method
const validate_update_product_data = require("../../controls/middleware/validation/product/validate-update");

// verify token method
const verify_token = require("../../controls/utils/token/verify-token");

// import the delete old image method
const delete_old_image = require("../../controls/utils/upload/delete-old-images");

// import upload images method
const upload_product_images = require("../../controls/utils/upload/upload-product-image");

// import delete_image method
const delete_image = require("../../controls/utils/upload/delete-images");

router.put("/", upload_product_images, async (req, res, next) => {
  try {
    // validate body data
    validate_update_product_data(req.body, next);

    // check if the request has a new data or not
    if (
      !req.body.title &&
      !req.body.description &&
      !req.body.count &&
      !req.body.price &&
      !req.body.brand &&
      !req.body.product_number &&
      !req.body.tags &&
      !req.body.images_for_delete
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

    // verify token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token is equal id in body
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

    // check if the admin can update
    if (admin.account_type == "user") {
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
          404
        )
      );
    }

    // update the product
    const updated_product = await Product.findByIdAndUpdate(
      { _id: req.body.product_id },
      {
        $set: {
          title: req.body.title ? req.body.title : product.title,
          description: req.body.description
            ? req.body.description
            : product.description,
          count: req.body.count ? req.body.count : product.count,
          brand: req.body.brand ? req.body.brand : product.brand,
          product_number: req.body.product_number
            ? req.body.product_number
            : product.product_number,
          price: req.body.price ? req.body.price : product.price,
          tags: req.body.tags
            ? req.body.tags.split("split_here")
            : req.body.tags,
        },
      },
      { new: true }
    );

    // craete a images for delete var
    let images_for_delete = [];

    // check if the request has a images_for_delete
    if (req.body.images_for_delete) {
      images_for_delete = req.body.images_for_delete.split("split_here");
    }

    // check if the images for delete length with
    if (
      product.images.length - images_for_delete.length + req.files.length ==
      0
    ) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا غير ممكن حذف جميع صور المنتج",
          }),
          403
        )
      );
    }

    // check if the request has a images for delete
    if (req.body.images_for_delete) {
      // loop and delete the selected images
      for (let i = 0; i < images_for_delete.length; i++) {
        delete_old_image(images_for_delete[i], next);
      }
    }

    // check if the request has a new images
    if (req.files && req.files.length > 0) {
      // set the uplaoded images to created product
      for (let i = 0; i < req.files.length; i++) {
        updated_product.images.push(
          `${process.env.HOST_URL}/products-images/${req.files[i].filename}`
        );
      }
    }

    // save the updated product
    await updated_product.save();

    // craete response
    const response = {
      message: {
        arabic: "تم التعديل بنجاح",
        product_data: updated_product,
      },
    };

    // send the resposne to client
    res.status(200).send(response);
  } catch (error) {
    // delete uploaded images
    delete_image(req.files, next);

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
