const Review = require('../models/review');
const Campground = require('../models/campground');


module.exports.createReview = async (req, res) => {
    //get the info for the campground with the ID and save it to variable
    const campground = await Campground.findById(req.params.id);
    //create a new review from the form submission
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //push the new review to the campground's review array
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    //get the id for the campground as well as the review
    const {id, reviewId } = req.params;
    //update the campground using the $pull operator to remove all reviews with the given ID
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    //delete the review from the reviews collection as well
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
}