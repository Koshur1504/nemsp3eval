/* eslint-disable no-undef */
require("dotenv").config();

exports.DB_URL = process.env.DB_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.SALT = +process.env.SALT;
exports.PORT = process.env.PORT;
