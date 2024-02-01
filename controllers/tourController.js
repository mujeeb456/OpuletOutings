const Tour = require("./../modules/TourModel");
const APIFeatures = require("./../utilis/apiFeatures");
const catchAsync = require("./../utilis/catchAsync");
const factory = require("./handlerFactory");
const { Query } = require("mongoose");
const { query } = require("express");
const AppError = require("../utilis/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// const tours= JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID=(req,res,next,val)=>{
//     console.log(`Tour id is:${val}`);

//     if(req.params.id*1>tours.length){
//         return res.status(404).json({
//             status:'fail',
//             message:"Invalid ID"

//         });
//     }
//     next();
// };

// exports.checkBody=(req,res,next)=>{
//     if(!req.body.name||!req.body.price){
//         return res.status(400).json({
//             status:'fail',
//             message:"Missing name or price"
//         })
//     }
//     next();
// }

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour=catchAsync(async(req,res,next)=>{

//         const tour=await Tour.findByIdAndDelete(req.params.id)

//         if(!tour){
//             return next(new AppError('NO tour found with that ID',404))
//         }

//         res.status(204).json({
//             status:'success',
//             data:null
//         });

// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //     $match:{_id:{$ne:"easy"}}
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numToursStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    // {
    //     $limit:12
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
