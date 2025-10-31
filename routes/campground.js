// =============== Import Required Modules ===============
const express = require("express");
const router = express.Router(); // Create a router instance for grouping routes

// Custom utility to handle async errors without try/catch blocks
const catchAsync = require("../utilities/catchAsync");

// Custom error class for throwing HTTP errors
const ExpressError = require("../utilities/ExpressError");

// Mongoose Campground model (database schema)
const Campground = require("../models/campground");

// Custom middleware to protect routes (check if user is logged in)
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const campground = require("../controllers/campground");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
// =============== Validation Middleware ===============

// =============== Routes ===============

// =============== Easy Way To Write Routes ===============
router.route("/").get(catchAsync(campground.index))
.post(
  isLoggedIn,
  upload.array("images"),
  validateCampground,
  catchAsync(campground.createCampground)
);
// also use "single" to get Single Image and "array" to get multiple images

router.get("/new", isLoggedIn, campground.randerNewForm);

router
  .route("/:id")
  .get(catchAsync(campground.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("images"),
    validateCampground,
    catchAsync(campground.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.randerEditForm)
);

module.exports = router;

// ================ "COMPLEX METHOD" ================

// // ========== GET /campground ==========
// // Show all campgrounds (main listing page)
// router.get("/", catchAsync(campground.index));

// // ========== GET /campground/new ==========
// // Show form to create a new campground
// router.get("/new", isLoggedIn, campground.randerNewForm);

// // ========== POST /campground ==========
// // Create a new campground and save to DB
// router.post(
//   "/",
//   isLoggedIn, // Check if user is logged in
//   validateCampground, // Validate data using Joi
//   catchAsync(campground.createCampground)
// );

// // ========== GET /campground/:id ==========
// // Show a specific campground by ID
// router.get("/:id", catchAsync(campground.showCampground));

// // ========== GET /campground/:id/edit ==========
// // Show edit form for an existing campground
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isAuthor, // Only logged-in users can edit
//   catchAsync(campground.randerEditForm)
// );

// // ========== PUT /campground/:id ==========
// // Update campground in the database
// router.put(
//   "/:id",
//   isLoggedIn, // Protect route
//   isAuthor,
//   validateCampground, // Validate updated data
//   catchAsync(campground.updatCampground)
// );

// // ========== DELETE /campground/:id ==========
// // Delete campground from the database
// router.delete(
//   "/:id",
//   isLoggedIn, // Only logged-in users can delete
//   isAuthor,
//   catchAsync(campground.deleteCampground)
// );

// // =============== Export Router ===============
// // Makes these routes available in app.js via app.use('/campground', campgroundRoutes)
// module.exports = router;
