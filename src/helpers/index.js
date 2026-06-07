"use strict";

// passwordEncrypt(password:string):
const crypto = require("node:crypto"),
  keyCode = process.env.SECRET_KEY,
  loopCount = 10_000,
  charCount = 32,
  encType = "sha512";

const passwordEncrypt = function (password) {
  return crypto
    .pbkdf2Sync(password, keyCode, loopCount, charCount, encType)
    .toString("hex");
};

class CustomError extends Error {
  name = "CustomError";
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { passwordEncrypt, CustomError };