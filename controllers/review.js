// =============== Import Required Modules ===============
// Import Campground and Review models
const Campground = require("../models/campground");
const Review = require("../models/review");

// =============== Controller for Reviews to export for routes and routes export for app.js ===============
// =============== Create Review Router ===============
module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id); // Get campground by ID
  const review = new Review(req.body.review); // Create new Review instance with form data
  // review.author = req.user._id; // Get user id from author "For Review"
  review.author = req.user._id;
  campground.review.push(review); // Add review to campground's review array
  await review.save(); // Save review to DB
  await campground.save(); // Save campground with new review reference
  req.flash("success", "Created new review!!"); // Flash success message
  res.redirect(`/campgrounds/${campground._id}`); // Redirect to the campground's show page
};

// =============== Delete Review Router ===============
module.exports.deleteReview = async (req, res) => {
  // Destructure both campground ID and review ID from the URL parameters
  const { id, reviewId } = req.params;

  // Remove the reference to the review from the campground using MongoDB's $pull operator
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });

  // Delete the actual review document from the Review collection
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`); // Redirect back to the campground's show page
};
