const Joi = require("joi");

// import ApiError method
const ApiError = require("../../../utils/error/ApiError");

const validate_update_dollar = (data, next) => {
  // create the Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    dollar_id: Joi.string().required(),
    price: Joi.number().required(),
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

module.exports = validate_update_dollar;
