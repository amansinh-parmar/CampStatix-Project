// ================== Import Modules ==================
const express = require("express");
const router = express.Router(); // Create a router instance

const User = require("../models/user"); // Mongoose User model
const catchAsync = require("../utilities/catchAsync"); // Async error handler
const passport = require("passport"); // For user authentication
const { storeReturnTo } = require("../middleware"); // Custom middleware to store intended redirect path

const users = require("../controllers/user");

// ================== Routes ==================

// ========== GET /register ==========
// Show the registration form
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register)); // Handle user registration logic

// ========== GET /login ==========
// Show the login form
router
  .route("/login")
  .get(users.renderLogin)
  // Handle user login logic
  .post(
    // Middleware to remember the page user was trying to visit before logging in
    storeReturnTo,
    // Passport handles the authentication logic using the 'local' strategy (username + password)
    passport.authenticate("local", {
      failureFlash: true, // Show error message on failure
      failureRedirect: "/login", // Redirect back to login on failure
    }),
    users.login // Get route data from 'controller' via "user.js"
  );

// ========== GET /logout ==========
// Handle user logout
router.get("/logout", users.logout);

// ========== Export Router ==========
module.exports = router;
