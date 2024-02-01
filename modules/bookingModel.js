const mongoose = require("mongoose");
const Tour = require("./TourModel");
const User = require("./UserModel");
const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Must have a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Must have a user"],
    },
    email: {
      type: String,
      required: [false],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
