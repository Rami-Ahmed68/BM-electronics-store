const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate api error method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

router.get("/", async (req, res, next) => {
  try {
    // craete a page
    const page = req.query.page || 1;

    const limit = req.query.limit || 5;

    const skip = (page - 1) * limit;

    // get to admins
    const admins = await Admin.find().skip(skip).limit(limit).sort({ _id: -1 });

    // craete response
    const response = {
      admins: admins.map((admin) =>
        _.pick(admin, [
          "_id",
          "name",
          "gender",
          "account_type",
          "avatar",
          "joind_at",
        ])
      ),
    };

    // send the response to clinte
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
