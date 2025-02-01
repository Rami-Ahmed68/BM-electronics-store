const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../model/admin/admin");

// import product model
const Product = require("../../model/product/product");

// import validate create product data method
const validate_create_product_data = require("../../controls/middleware/validation/product/validate-create");

// import verify token data method
const verify_token = require("../../controls/utils/token/verify-token");

// import upload images method
const upload_product_images = require("../../controls/utils/upload/upload-product-image");

// import delete uploaded images method
const delete_image = require("../../controls/utils/upload/delete-images");

router.post("/", upload_product_images, async (req, res, next) => {
  try {
    // validate body data
    validate_create_product_data(req.body, next);

    // check if the request has any image or not
    if (req.files.length == 0) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال صورة واحدة على الأقل",
          }),
          403
        )
      );
    }

    // find the admin by id
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على حساب الأدمن",
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

    // check if the account type is user (cann't edait)
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

    // create a product
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      count: req.body.count,
      price: req.body.price,
      brand: req.body.brand,
      product_number: req.body.product_number,
      tags: req.body.tags.split("split_here"),
      created_by: req.body.admin_id,
      created_at: new Date(),
    });

    // set the uplaoded images to created product
    for (let i = 0; i < req.files.length; i++) {
      product.images.push(
        `${process.env.HOST_URL}/products-images/${req.files[i].filename}`
      );
    }

    // save the product in data base
    await product.save();

    // craete response
    const response = {
      message: {
        arabic: "تم إنشاء المنتج بنجاح",
        product_data: _.pick(product, [
          "_id",
          "title",
          "description",
          "count",
          "price",
          "images",
          "brand",
          "product_number",
          "tags",
          "created_at",
        ]),
      },
    };

    // send the resposne
    res.status(200).send(response);
  } catch (error) {
    // delete uploaded images
    delete_image(req.files, next);

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
