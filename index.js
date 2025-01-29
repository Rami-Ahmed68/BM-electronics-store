const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
app.use(express.json());

// import error validation
const Global = require("./src/controls/middleware/errors/validate_errors");
// import error validation

// import admin's files
const create_admin = require("./src/router/auth/admin/create");
const delete_admin = require("./src/router/auth/admin/delete");
const get_one_admin = require("./src/router/auth/admin/get.one");
const get_all_admin = require("./src/router/auth/admin/get.all");

app.use("/api/v1/bm/admin/create", create_admin);
app.use("/api/v1/bm/admin/delete", delete_admin);
app.use("/api/v1/bm/admin/get/one", get_one_admin);
app.use("/api/v1/bm/admin/get/all", get_all_admin);

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
