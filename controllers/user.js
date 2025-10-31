// ================== Import Modules ==================
const User = require("../models/user"); // Mongoose User model

// =============== Controller for Users to export for routes and routes export for app.js ===============
// =============== Register New User Router ===============
module.exports.renderRegister = (req, res) => {
  res.render("users/register"); // Renders views/users/register.ejs
};

// User Regitered Successfully
module.exports.register = async (req, res, next) => {
  try {
    // Destructure form input values
    const { username, email, password } = req.body;

    // Create a new user instance (only email & username here, password is handled by plugin)
    const user = new User({ email, username });

    // Register the user (this hashes the password and saves it)
    const registerUser = await User.register(user, password);

    // Auto-login the user after successful registration
    req.login(registerUser, (err) => {
      if (err) return next(err);
      console.log(registerUser);
      req.flash("success", "Welcome to YelpCamp!"); // Flash welcome message
      res.redirect("/campgrounds"); // Redirect to campground listing
    });
  } catch (err) {
    req.flash("error", err.message); // Show error message (e.g., duplicate username)
    res.redirect("/register"); // Redirect back to registration form
  }
};

// =============== Users Login Router ===============
module.exports.renderLogin = (req, res) => {
  res.render("users/login"); // Renders views/users/login.ejs
};

// User Logged In
module.exports.login = // After login, redirect user to their original destination or a default
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds"; // Default redirect
    res.redirect(redirectUrl);
  };

// =============== Users Logout Router ===============
module.exports.logout = (req, res) => {
  // Passport's logout method — removes user from session
  req.logout(function (err) {
    if (err) {
      return next(err); // If error during logout, forward to error handler
    }
    req.flash("success", "Goodbye!"); // Flash logout message
    res.redirect("/campgrounds"); // Redirect to home or campgrounds
  });
};
