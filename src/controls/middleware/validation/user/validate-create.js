const Joi = require("joi");

// import ApiError method
const ApiError = require("../../../utils/error/ApiError");

const validate_create_user_data = (data, next) => {
  // create the Schema
  const Schema = Joi.object().keys({
    fisrt_name: Joi.string().required(),
    last_name: Joi.string().required(),
    gender: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  // validate the data using the created Schema
  const Error = Schema.validate(data);

  // check if the validation has any error
  if (Error.error) {
    // return error
    return next(
      new ApiError(
        JSON.stringify({
          arabic: "... عذرا خطأ في البيانات المرسلة",
        }),
        400
      )
    );
  }
};

module.exports = validate_create_user_data;
