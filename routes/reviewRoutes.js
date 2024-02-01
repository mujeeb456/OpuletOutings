const express=require('express')
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authController')

const router=express.Router({mergeParams:true});

//Post /tour/2234fad4/reviews
//GET/tour/2234fad4/reviews
//Post/reviews

router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    //authController.protect,
    //authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
   );  

router.route('/:id')
     .get(reviewController.getReview)
     .patch(reviewController.updateReview)
     .delete(reviewController.deleteReview) 

module.exports=router;