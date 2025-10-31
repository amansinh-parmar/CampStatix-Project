// =================== Middleware Functions ===================

// Middleware to check if the user is authenticated (logged in)
// If the user is NOT logged in:
//   1. Store the URL they originally requested in the session as 'returnTo'
//   2. Make 'returnTo' available in response locals (for redirects after login)
//   3. Flash an error message asking them to sign in
//   4. Redirect them to the login page
// If the user IS logged in, simply call next() to continue

// =============== Import Required Modules ===============

// Joi validation schema for campground input
const { campgroundSchema, reviewSchema } = require("./schemas");
// Custom error class for throwing HTTP errors
const ExpressError = require("./utilities/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

//==>> Middleware to Validate User Login
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store the original URL the user wanted to access
    req.session.returnTo = req.originalUrl;
    res.locals.returnTo = req.session.returnTo;

    // Flash an error to inform user they need to log in first
    req.flash("error", "You must be signed in first!");

    // Redirect to login page
    return res.redirect("/login");
  }
  next(); // User is authenticated, proceed to next middleware or route handler
};

// Middleware to transfer the 'returnTo' URL from session to res.locals
// This allows templates or redirect logic to access 'returnTo' easily after login
// It ensures the user can be redirected back to where they wanted to go

//==>> Middleware to ReturnTo the Session page
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    // Make 'returnTo' available to views and later middleware
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//==>> Middleware to Validate Campground
// This function validates form input using Joi before saving or updating
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body); // Validate request body
  if (error) {
    const msg = error.details.map((el) => el.message).join(","); // Join all error messages
    throw new ExpressError(msg, 400); // Throw custom error if invalid
  } else {
    next(); // Proceed to route handler
  }
};

//==>> Middleware to Validate User and User_id
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//==>> Middleware to Validate Review Input
module.exports.validReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate review form data
  if (error) {
    // Map all error messages and join them into one string
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400); // Throw a formatted custom error
  } else {
    next(); // Proceed to next middleware or route handler
  }
};
