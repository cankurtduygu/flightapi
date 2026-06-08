"use strict";

const { mongoose } = require("../configs/dbConnection");

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      trim: true,
      required: true,
    },

    airline: {
      type: String,
      trim: true,
      required: true,
    },

    departureAirport: {
      type: String,
      trim: true,
      required: true,
    },

    departureCity: {
      type: String,
      trim: true,
      required: true,
    },

    departureCountry: {
      type: String,
      trim: true,
      required: true,
    },

    arrivalAirport: {
      type: String,
      trim: true,
      required: true,
    },

    arrivalCity: {
      type: String,
      trim: true,
      required: true,
    },

    arrivalCountry: {
      type: String,
      trim: true,
      required: true,
    },

    departureDate: {
      type: Date,
      required: true,
    },

    arrivalDate: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      trim: true,
      default: "EUR",
      enum: ["EUR", "USD", "TRY"],
    },

    status: {
      type: String,
      enum: ["scheduled", "delayed", "cancelled", "completed"],
      default: "scheduled",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "flights",
    timestamps: true,
  }
);

module.exports = mongoose.model("Flight", flightSchema);
