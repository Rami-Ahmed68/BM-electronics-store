const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import dollar model
const Dollar = require("../../model/dollar/dollar");

// import admin model
const Admin = require("../../model/admin/admin");

// import validate-craete-dollar method
const validate_create_dollar = require("../../controls/middleware/validation/dollar/validate-craete");

// import verify token method
const verify_token = require("../../controls/utils/token/verify-token");

router.post("/", async (req, res, next) => {
  try {
    // validate the body data
    validate_create_dollar(req.body);

    // get all dollars documents
    const dollars = await Dollar.find();

    // check if the dollars length more than 1
    if (dollars.length > 0) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا غير مسموح بانشاء اكثر من سعر دولار واحد",
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

    // check if the user s admin or super admin
    if (admin.account_type != "super_admin") {
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

    // verify token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id is equal id in token
    if (req.body.admin_id != verify_token_data._id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا خطأ في البيانات المرسلة",
          }),
          401
        )
      );
    }

    // craete a dollar
    const dollar = new Dollar({
      price: req.body.price,
    });

    // save the created dollar
    await dollar.save();

    // create response
    const response = {
      message: {
        arabic: "تم إنشاء سعر الدولار بنجاح",
        dollar: dollar,
      },
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
    // return the error
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
