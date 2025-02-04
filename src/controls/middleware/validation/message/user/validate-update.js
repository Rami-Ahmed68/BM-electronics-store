const Joi = require("joi");

// import ApiError method
const ApiError = require("../../../../utils/error/ApiError");

const validate_update_message_data = (data, next) => {
  // create the Schema
  const Schema = Joi.object().keys({
    user_id: Joi.string().required(),
    message_id: Joi.string().required(),
    title: Joi.string().allow(""),
    custom_message: Joi.string().allow(""),
    images_for_delete: Joi.string().allow(""),
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

module.exports = validate_update_message_data;
