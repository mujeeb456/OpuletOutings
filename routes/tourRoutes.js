
const express=require('express')
const tourController=require('./../controllers/tourController')
const authController=require('./../controllers/authController')
const reviewRouter=require('./../routes/reviewRoutes')
const router=express.Router();


// router.param('id',tourController.checkID)




//post /tour/234oi/reviews
//get/tour/234oi/reviews
//get/tour/234oi/reviews/9409ids


// router
//   .route('/:touid/reviews')
//   .post(
//   // authController.protect,
//   // authController.restrictTo('user'),
//    reviewController.createReview
//    );

router.use('/:tourId/reviews',reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours,tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/tour-wihtin/:')

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.createTour);

router
   .route('/:id')
   .get(tourController.getTour)
   .patch(
    authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.updateTour
    )
   .delete(authController.protect,authController.restrictTo('admin','lead-guide'), tourController.deleteTour);




module.exports=router;