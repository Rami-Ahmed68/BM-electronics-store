const bcrypt = require("bcrypt");

// import validte api error method
const ApiError = require("../../utils/error/ApiError");

// compare password's
const compare = (password1, password2, next) => {
  // return bcrypt.compare(password1, password2);
  if (!bcrypt.compare(password1, password2)) {
    return next(
      new ApiError(
        JSON.stringify({
          arabic: "عذرا خطأ في الإيميلي او كلمة المرور",
        }),
        403
      )
    );
  }
};

module.exports = compare;
