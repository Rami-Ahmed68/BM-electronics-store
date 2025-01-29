const express = require("express");
const router = express.Router();

// import ApiError method
const ApiError = require("../../../controls/utils/error/ApiError");

// import admin's model
const Admin = require("../../../model/admin/admin");

// import validate_create_admin_data's method
const validate_create_admin_data = require("../../../controls/middleware/validation/admin/validate-create");

// import upload avatar file
const upload_avatar = require("../../../controls/utils/upload/upload-admin-avatar");

// import checks_exists_account method
const checks_exists_account = require("../../../controls/utils/account-checks/account-exists");

// import generate token method
const generate_token = require("../../../controls/utils/token/generate-token");

// import hashing password method
const hashing = require("../../../controls/utils/password/hashing");

router.post("/", upload_avatar, async (req, res, next) => {
  try {
    // validat the body data
    validate_create_admin_data(req.body, next);

    // check if the email is exists
    await checks_exists_account("admin", req.body.email, next);

    // create admin
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: await hashing(req.body.password),
      gender: req.body.gender,
      account_type: req.body.account_type,
      avatar:
        req.body.gender == "male"
          ? process.env.DEFAULT_Male_AVATAR
          : process.env.DEFAULT_FEMALE_AVATAR,
      joind_at: req.body.joind_at,
    });

    const generated_token = generate_token(admin._id, admin.email);

    // save the admin
    await admin.save();

    // create the response
    const response = {
      message: "تم إنشاء الحساب بنجاح",
      admin_data: admin,
      token: generated_token,
    };

    // send the resposne to the clinte
    res.status(200).send(response);
  } catch (error) {
    // check if the request has a file (avatar)
    if (req.files && req.files.length > 0) {
      // delete the file
      delete_image(req.files, next);
    }

    // return the error
    return next(
      new ApiError(
        JSON.stringify({
          arabic: "... عذرا خطأ عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
