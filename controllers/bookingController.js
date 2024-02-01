const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../modules/TourModel");
const Booking = require("../modules/bookingModel");
const catchAsync = require("../utilis/catchAsync");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 10,
        },
        quantity: 1,
      },
    ],

    // line_items: [
    //   {
    //     name: `${tour.name} Tour`,
    //     description: tour.summary,
    //     amount: tour.price * 100,
    //     currency: "usd",
    //     quantity: 1,
    //   },
    // ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});
exports.paid = catchAsync(async (req, res, next) => {
  const newBooking = await Booking.create({
    tour: req.body.tour,
    price: req.body.price,
    user: req.body.user,
    email: req.body.email,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      booking: newBooking,
    },
  });
});
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routesss
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
