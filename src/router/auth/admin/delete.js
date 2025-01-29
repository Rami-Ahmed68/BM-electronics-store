const express = require("express");
const router = express.Router();

// import api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

// import validate_delete_admin_data's method
const validate_delete_admin_data = require("../../../controls/middleware/validation/admin/validate-delete");

// import delete files method
const delete_image = require("../../../controls/utils/upload/delete-images");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    validate_delete_admin_data(req.body, next);

    // find the super admin by his id
    const super_admin = await Admin.findById(req.body.super_admin_id);

    // check if the super admin is exists
    if (!super_admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على حساب السوبر ادمن",
          }),
          404
        )
      );
    }

    // check if the super admin is super admin
    if (super_admin.account_type != "super_admin") {
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

    // find the admin by his id
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin's avatar is not a default avatar
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

    // delete avatar
    delete_image([admin.avatar], next);

    // delete the admin
    await Admin.deleteOne(admin._id);

    // craete response to send it to clinte
    const response = {
      message: {
        arabic: "تم حذف الأدمن بنجاح",
      },
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
    // return the error message
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
