const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "../../config/.env" });

const hashing_password = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
  return (password = bcrypt.hash(password, salt));
};

module.exports = hashing_password;
