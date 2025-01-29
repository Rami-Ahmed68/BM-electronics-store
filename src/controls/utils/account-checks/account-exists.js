// import the admin model
const Admin = require("../../../model/admin/admin");

// import the user model
const User = require("../../../model/user/user");

// import ApiError method
const ApiErrors = require("../error/ApiError");

const checks_exists_account = async (model, account_email, next) => {
  if (model === "admin") {
    // find the account by email
    const admin_email = await Admin.findOne({ email: account_email });

    // check if the admin_email is exists
    if (admin_email) {
      // return success message
      return next(
        new ApiErrors(
          JSON.stringify({
            arabic: "عذرا الايميل مستخدم بالفعل",
          }),
          403
        )
      );
    }
  } else if (model === "user") {
    // find the account by email
    const user_email = await User.findOne({ email: account_email });

    // check if the user_email is exists
    if (user_email) {
      // return success message
      return next(
        new ApiErrors(
          JSON.stringify({
            arabic: "عذرا الايميل مستخدم بالفعل",
          }),
          403
        )
      );
    }
  }
};

module.exports = checks_exists_account;
