"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// sync();
const { mongoose } = require("../configs/dbConnection");
// const Reservation = require("../models/reservation");
const User = require("../models/user");
// const Car = require("../models/car");
const { users, cars, reservations } = require('./dummyData');

module.exports = async function () {

  /* REMOVE DATABASE */
  mongoose.connection.dropDatabase().then(() => console.log("- Database and all data DELETED!"));

  /* ------------------------- */
  User.insertMany(users).then(() => console.log('users added'));

  /* ------------------------- */
  // Car.insertMany(cars).then(() => console.log("cars added"));

  /* ------------------------- */
  // Reservation.insertMany(reservations).then(() => console.log("reservations added"));

};
