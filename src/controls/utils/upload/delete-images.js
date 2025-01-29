const path = require("path");
const fs = require("fs");

// import validate api erorr method
const ApiError = require("../../utils/error/ApiError");

const delete_image = (files, next) => {
  files.forEach((file) => {
    if (
      file != process.env.DEFAULT_MALE_AVATAR &&
      file != process.env.DEFAULT_FEMALE_AVATAR
    ) {
      fs.unlink(file.path, (error) => {
        if (error) {
          return next(
            new ApiError(
              JSON.stringify({
                arabic: "عذرا خطأ اثناء حذف الصور",
              }),
              400
            )
          );
        }
      });
    }
  });
};

module.exports = delete_image;
