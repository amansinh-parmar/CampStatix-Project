// =============== Import Modules ===============
const express = require("express");

// `mergeParams: true` allows this router to access the :id param from the parent route (/campground/:id/review)
const router = express.Router({ mergeParams: true });

// Joi validation schema for reviews
const { validReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// Import Campground and Review models
const Campground = require("../models/campground");
const Review = require("../models/review");

// Custom utility to handle async/await errors
const catchAsync = require("../utilities/catchAsync");

// Custom error handler class
const ExpressError = require("../utilities/ExpressError");
const campground = require("../models/campground");

const review = require("../controllers/review");
// =============== Middleware to Validate Review Input ===============

// =============== Routes ===============

// ========== POST /campground/:id/review ==========
// Create and add a new review to a specific campground
router.post(
  "/",
  isLoggedIn,
  validReview, // Validate review data using Joi
  catchAsync(review.createReview)
);

// ========== DELETE /campground/:id/review/:reviewId ==========
// Delete a review from both the reviews collection and the campground's reference array
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.deleteReview)
);

// =============== Export Router ===============
// This router is mounted in app.js under: app.use("/campground/:id/review", reviewRoutes);
module.exports = router;
