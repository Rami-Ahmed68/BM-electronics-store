const Joi = require("joi");

// import ApiError method
const ApiError = require("../../../utils/error/ApiError");

const validate_update_user_data = (data, next) => {
  // create the Schema
  const Schema = Joi.object().keys({
    user_id: Joi.string().required(),
    first_name: Joi.string().allow(""),
    last_name: Joi.string().allow(""),
    password: Joi.string().allow(""),
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

module.exports = validate_update_user_data;
