const jwt = require("jsonwebtoken");

const generate_token = (_id, email) => {
  return jwt.sign({ _id: _id, email: email }, process.env.SECRET_KEY);
};

module.exports = generate_token;
