const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
app.use(express.json());

// access to avatar's
app.use("/avatars", express.static(path.join(__dirname, "./public/avatars")));
// access to avatar's

// access to products-images's
app.use(
  "/products-images",
  express.static(path.join(__dirname, "./public/products-images"))
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
const register_user = require("./src/router/auth/user/register");
const update_user = require("./src/router/auth/user/update");
const login_user = require("./src/router/auth/user/login");
const delete_user = require("./src/router/auth/user/delete");
const get_one_user = require("./src/router/auth/user/get.one");
const get_all_user = require("./src/router/auth/user/get.all");
// import user's files

// creating an user's apis
app.use("/api/v1/bm/user/register", register_user);
app.use("/api/v1/bm/user/update", update_user);
app.use("/api/v1/bm/user/login", login_user);
app.use("/api/v1/bm/user/delete", delete_user);
app.use("/api/v1/bm/user/get/one", get_one_user);
app.use("/api/v1/bm/user/get/all", get_all_user);
// creating an user's apis

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

app.use(express.urlencoded({ extended: true }));

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
