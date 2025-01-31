const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import validate_update_admin_data method
const validate_update_admin_data = require("../../../controls/middleware/validation/admin/validate-update");

// import hashig password
const hashig = require("../../../controls/utils/password/hashing");

// import verify token method
const verify_token = require("../../../controls/utils/token/verify-token");

router.put("/", async (req, res, next) => {
  try {
    // validate body data
    validate_update_admin_data(req.body, next);

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is eixsts
    if (!admin) {
      // return the error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الأدمن ",
          }),
          404
        )
      );
    }

    // verify the token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin id in token is like the id in body
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

    const updated_admin = await Admin.findByIdAndUpdate(
      { _id: req.body.admin_id },
      {
        $set: {
          name: req.body.name ? req.body.name : admin.name,
          password: req.body.password
            ? await hashig(req.body.password)
            : admin.password,
        },
      },
      { new: true }
    );

    // create a response
    const response = {
      message: {
        arabic: "تم التعيل بنجاح",
      },
      admin_data: updated_admin,
    };

    // send teh response to clinte
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
