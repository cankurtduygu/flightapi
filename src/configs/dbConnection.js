"use strict";

// MongoDB Connection:

const mongoose = require("mongoose");

const dbConnection = async function () {
  await mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("* DB Connected *"))
    .catch((err) => {
      console.log("! DB Not Connected !");
      throw err;
    });
};

/* ------------------------------------------------------- */
module.exports = {
  mongoose,
  dbConnection,
};
