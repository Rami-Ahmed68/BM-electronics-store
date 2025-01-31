const path = require("path");
const fs = require("fs");

// import validate api erorr method
const ApiError = require("../error/ApiError");

const delete_old_avatar = (file, next) => {
  // splid the avatar url
  const splited_avatar_url = file.split("/");

  // export the file's name of splited_avatar_url arra
  const file_name = splited_avatar_url[splited_avatar_url.length - 1];

  const imagePath = path.join(
    __dirname,
    "../../../../public/avatars",
    file_name
  );

  if (
    file != process.env.DEFAULT_MALE_AVATAR &&
    file != process.env.DEFAULT_FEMALE_AVATAR &&
    file != ""
  ) {
    fs.unlink(imagePath, (error) => {
      if (error) {
        return next(
          new ApiError(
            JSON.stringify({
              arabic: "عذرا خطأ اثناء حذف الافاتار",
            }),
            400
          )
        );
      }
    });
  }
};

module.exports = delete_old_avatar;
