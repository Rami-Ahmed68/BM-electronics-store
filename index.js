const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
app.use(express.json());

// import valiadte ApiError
const ApiError = require("./src/controls/utils/error/ApiError");

// access to avatar's
app.use("/avatars", express.static(path.join(__dirname, "./public/avatars")));
// access to avatar's

// access to products-images's
app.use(
  "/products-images",
  express.static(path.join(__dirname, "./public/products-images"))
);
// access to products-images's

// access to products-images's
app.use(
  "/orders-images",
  express.static(path.join(__dirname, "./public/order-images"))
);
// access to products-images's

// import error validation
const Global = require("./src/controls/middleware/errors/validate_errors");
// import error validation

// import admin's files
const login_admin = require("./src/router/auth/admin/login");
const create_admin = require("./src/router/auth/admin/create");
const delete_admin = require("./src/router/auth/admin/delete");
const change_avatar_admin = require("./src/router/auth/admin/change.avatar");
const update_admin = require("./src/router/auth/admin/update");
const get_one_admin = require("./src/router/auth/admin/get.one");
const get_all_admin = require("./src/router/auth/admin/get.all");
// import admin's files

// creating an admin's apis
app.use("/api/v1/bm/admin/login", login_admin);
app.use("/api/v1/bm/admin/create", create_admin);
app.use("/api/v1/bm/admin/delete", delete_admin);
app.use("/api/v1/bm/admin/avatar/change", change_avatar_admin);
app.use("/api/v1/bm/admin/update", update_admin);
app.use("/api/v1/bm/admin/get/one", get_one_admin);
app.use("/api/v1/bm/admin/get/all", get_all_admin);
// creating an admin's apis

// import user's files
const change_avatar_user = require("./src/router/auth/user/change.avatar");
const register_user = require("./src/router/auth/user/register");
const update_user = require("./src/router/auth/user/update");
const login_user = require("./src/router/auth/user/login");
const delete_user = require("./src/router/auth/user/delete");
const get_one_user = require("./src/router/auth/user/get.one");
const get_all_user = require("./src/router/auth/user/get.all");
// import user's files

// creating an user's apis
app.use("/api/v1/bm/user/avatar/change", change_avatar_user);
app.use("/api/v1/bm/user/register", register_user);
app.use("/api/v1/bm/user/update", update_user);
app.use("/api/v1/bm/user/login", login_user);
app.use("/api/v1/bm/user/delete", delete_user);
app.use("/api/v1/bm/user/get/one", get_one_user);
app.use("/api/v1/bm/user/get/all", get_all_user);
// creating an user's apis

// import product's files
const create_product = require("./src/router/product/create");
const update_product = require("./src/router/product/update");
const delete_product = require("./src/router/product/delete");
const get_one_product = require("./src/router/product/get.one");
const get_all_product = require("./src/router/product/get.all");
const get_count_product = require("./src/router/product/get.count");
// import product's files

// creating a products apis
app.use("/api/v1/bm/product/create", create_product);
app.use("/api/v1/bm/product/update", update_product);
app.use("/api/v1/bm/product/delete", delete_product);
app.use("/api/v1/bm/product/get/all", get_all_product);
app.use("/api/v1/bm/product/get/one", get_one_product);
app.use("/api/v1/bm/product/get/count", get_count_product);
// creating a products apis

// import dollar's files
const create_dollar = require("./src/router/dollar/create");
const update_dollar = require("./src/router/dollar/update");
const get_dollar = require("./src/router/dollar/get");
// import dollar's files

// creating a dollars apis
app.use("/api/v1/bm/dollar/create", create_dollar);
app.use("/api/v1/bm/dollar/update", update_dollar);
app.use("/api/v1/bm/dollar/get", get_dollar);
// creating a dollars apis

// import order's files
const create_order = require("./src/router/order/create");
const delete_order = require("./src/router/order/delete");
const delete_order_admin = require("./src/router/order/admin/delete");
const update_order = require("./src/router/order/update");
const get_all_order = require("./src/router/order/get.all");
const get_one_order = require("./src/router/order/get.one");
// import order's files

// creating a orders apis
app.use("/api/v1/bm/order/create", create_order);
app.use("/api/v1/bm/order/delete", delete_order);
app.use("/api/v1/bm/order/admin/delete", delete_order_admin);
app.use("/api/v1/bm/order/update", update_order);
app.use("/api/v1/bm/order/get/all", get_all_order);
app.use("/api/v1/bm/order/get/one", get_one_order);
// creating a orders apis

// import message's files
const create_user_message = require("./src/router/message/user/create");
// import message's files

// creating a message's apis
app.use("/api/v1/bm/message/user/message/create", create_user_message);
// creating a message's apis

app.use(express.urlencoded({ extended: true }));

// handling not found
app.use("*", (req, res, next) => {
  return next(
    new ApiError(
      JSON.stringify({
        english: "Invalid Api Not Found ...",
        arabic: "... (API) عذرا لم يتم العثور على الرابط",
      }),
      404
    )
  );
});
// handling not found

// Global error handling middlware
app.use(Global);
// Global error handling middlware

mongoose
  .connect(process.env.DATA_BASE_CONNECTION_STRING)
  .then(() => {
    console.log("###connected###");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`App running on port : ${process.env.PORT}`);
});
