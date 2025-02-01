const rateLimit = require("express-rate-limit");

// import validte ApiError method
const ApiError = require("../../../utils/error/ApiError");

const login_limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    res.status(429).send({
      arabic:
        "عذرا لقد تجاوزت عدد محاولات التسجيل المسموح بها ، يرجى المحاولة في وقت أخر",
    });
  },
});

module.exports = login_limit;
