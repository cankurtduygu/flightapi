"use strict";
/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
/* ------------------------------------------------------- *
{
  "username": "normal",
  "password": "1234",
  "email": "normal@site.com",
  "isActive": true,
  "isStaff": false,
  "isAdmin": false
  }
  /* ------------------------------------------------------- */

const { mongoose } = require("../configs/dbConnection");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const { default: uniqueValidator } = require("mongoose-unique-validator");

// User Model:
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
      set: passwordEncrypt,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address.",
      ],
    },

    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isStaff: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true },
);

userSchema.plugin(uniqueValidator, {
  message: 'This {PATH} is already exist'
})

/* ------------------------------------------------------- */
module.exports = mongoose.model("User", userSchema);
