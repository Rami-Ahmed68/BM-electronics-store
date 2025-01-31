const express = require("express");
const router = express.Router();

// import validate ApiError method
const ApiError = require("../../controls/utils/error/ApiError");

// import dollar model
const Dollar = require("../../model/dollar/dollar");

router.get("/", async (req, res, next) => {
  try {
    // find the dollar
    const dollars = await Dollar.find();

    // create response
    const response = {
      dollar_data: dollars[0],
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
