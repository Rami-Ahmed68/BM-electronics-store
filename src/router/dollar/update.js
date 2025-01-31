const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import the dollar model
const Dollar = require("../../model/dollar/dollar");

// import the admin model
const Admin = require("../../model/admin/admin");

// import the validate update dollar method
const validate_update_dollar = require("../../controls/middleware/validation/dollar/validate-update");

// import verify token method
const verify_token = require("../../controls/utils/token/verify-token");

router.put("/", async (req, res, next) => {
  try {
    // validate the body data
    validate_update_dollar(req.body);

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

    // check if the admin id in body is equal id in token
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiError(
          JOSN.stringify({
            arabic: "عذرا خطأ في بيانات المستخدم",
          }),
          400
        )
      );
    }

    // find the dollar
    const dollar = await Dollar.findById(req.body.dollar_id);

    // check if the dollar is exists
    if (!dollar) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور  على سعر الدولار",
          }),
          404
        )
      );
    }

    // update the dollar
    const updated_dollar = await Dollar.findByIdAndUpdate(
      { _id: req.body.dollar_id },
      {
        $set: {
          price: req.body.price,
        },
      },
      { new: true }
    );

    // craete response
    const response = {
      message: {
        arabic: "تم التعديل بنجاح",
        dollar_data: updated_dollar,
      },
    };

    // send the response
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
