const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

router.get("/", async (req, res, next) => {
  try {
    // find the admin by id
    const admin = await Admin.findById(req.query.admin_id);

    // check if the admin is exists
    if (!admin) {
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // create response
    const response = {
      admin_data: _.pick(admin, [
        "_id",
        "name",
        "gender",
        "account_type",
        "avatar",
        "joind_at",
      ]),
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
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
