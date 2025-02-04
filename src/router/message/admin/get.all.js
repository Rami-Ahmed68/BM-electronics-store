const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin model
const Admin = require("../../../model/admin/admin");

router.get("/", async (req, res, next) => {
  try {
    // check if the query has a admin's id
    if (!req.query.admin_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            arabic: "عذرا يجب ارسال معرف الأدمن",
          }),
          403
        )
      );
    }

    // find the admin
    const admin = await Admin.find(req.query.admin_id).populate({
      path: "messages",
    });

    // create response
    const response = {
      admin_messages: admin.messages,
    };

    // send teh response to clinet
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
