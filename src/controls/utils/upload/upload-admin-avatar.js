const multer = require("multer");
const path = require("path");

// create a storage function (change name & save in folder)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../../../../public/avatars"));
  },
  filename: (req, file, callback) => {
    callback(
      nnull,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

// create a filtering method
const upload_avatar = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/png",
      "image/jpeg",
      "image/heic",
      // Add other allowed video mime types here
    ];

    // check if the upload image type is in allowedMimes's array
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          JSON.stringify({
            english: "Sorry, invalid file type ..",
            arabic: "... عذرا  خطأ في نوع ملف الصورة",
          })
        )
      );
    }
  },
}).single("avatar");

module.exports = upload_avatar;
