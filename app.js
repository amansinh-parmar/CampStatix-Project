if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ quiet: true });
}

// =============== Import Required Modules ===============
const express = require("express");
const app = express();
const path = require("path");

// Session and flash messages for storing user sessions and showing temporary messages
const session = require("express-session");
const flash = require("connect-flash");

// ejs-mate allows us to use layouts/partials with EJS templates
const ejsMate = require("ejs-mate");

// Allows PUT & DELETE methods via query parameter (?_method=DELETE)
const methodOverride = require("method-override");

// Passport is used for authentication
const passport = require("passport");
const localStrategy = require("passport-local");

// Custom error handling class (we use this to throw custom errors)
const ExpressError = require("./utilities/ExpressError");

// User model from Mongoose (used for authentication & user database)
const User = require("./models/user");

// Route files (these are separated route logic files for cleanliness)
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

const sanitizeV5 = require("./utilities/mongoSanitizeV5");

const helmet = require("helmet");

// =============== Connect to MongoDB ===============
const mongoose = require("mongoose");
const { url } = require("inspector");
const MongoStore = require("connect-mongo");
const { func } = require("joi");

// const dbUrl = process.env.DB_URL;
const dbUrl =
  process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp-maptiler";

// Connect to local MongoDB server & database "yelp-camp"
// "mongodb://127.0.0.1:27017/yelp-camp-maptiler"

// Check for successful or failed database connection

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection ERROR!!"));
db.once("open", () => {
  console.log("MongoDB Connected Successfully!!");
});

// =============== Set Up Express Middleware ===============

app.set("query parser", "extended");

// Set view engine to EJS for rendering HTML
app.set("view engine", "ejs");

// Set views directory to 'views' folder
app.set("views", path.join(__dirname, "views"));

// Use ejs-mate engine for layout support
app.engine("ejs", ejsMate);

// Parse URL-encoded bodies (used for form data)
app.use(express.urlencoded({ extended: true }));

// Allow method override (for PUT/DELETE methods in forms)
app.use(methodOverride("_method"));

// Serve static files from 'public' directory (like CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// To remove data using these defaults:
app.use(sanitizeV5({ replaceWith: "_" }));

// =============== Session Configuration ===============
const secret = process.env.SECRET || "ThisShouldBeBetterSecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR!!", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret, // secret key for signing the session ID cookie
  resave: false, // don't save session if not modified
  saveUninitialized: true, // save uninitialized sessions (helpful for login/logout flow)
  cookie: {
    httpOnly: true, // for security: client-side JS can't access the cookie
    // secure: true,  // for HTTPS for Security
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week from now
    maxAge: 1000 * 60 * 60 * 24 * 7, // maximum age of cookie (1 week)
  },
};
app.use(session(sessionConfig)); // Add session middleware to app
app.use(flash()); // Enable flash messages for alerts (like success/fail messages)
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.tiles.mapbox.com/",
  // "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.mapbox.com/",
  // "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
  "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://images.unsplash.com/",
        "https://res.cloudinary.com/dsveno5v2/",
        "https://api.maptiler.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// =============== Passport Authentication Setup ===============
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Persistent login sessions

// Use 'localStrategy' for login using username and password (provided by passport-local-mongoose)
passport.use(new localStrategy(User.authenticate()));

// These methods serialize and deserialize user info to and from the session
passport.serializeUser(User.serializeUser()); // Store user in session
passport.deserializeUser(User.deserializeUser()); // Remove user from session

// =============== Flash Message Middleware ===============
// Middleware to pass user & flash message info to ALL templates
app.use((req, res, next) => {
  console.log(req.query);
  // console.log(req.session); // Optional: logs current session data
  res.locals.currentUser = req.user; // Makes 'currentUser' available in templates
  res.locals.success = req.flash("success"); // Pass success messages
  res.locals.error = req.flash("error"); // Pass error messages
  next();
});

/*
// Optional Middleware to Save Return Path (e.g., after login redirect back)
app.use((req, res, next) => {
  if (
    !req.user &&
    req.method === "GET" &&
    !req.path.startsWith("/login") &&
    !req.path.startsWith("/register")
  ) {
    req.session.returnTo = req.originalUrl;
    console.log("Stored returnTo:", req.session.returnTo);
  }
  next();
});
*/

// =============== ROUTES ===============

// ========== TEMP ROUTE TO CREATE FAKE USER ==========
app.get("/fakeUser", async (req, res) => {
  // This creates a new user with username 'Jack' and password 'cars'
  const user = new User({ email: "jackreacher@gmail.com", username: "Jack" });
  const newUser = await User.register(user, "cars");
  res.send(newUser); // returns the new user in response
});

// Use imported route files for better structure & modularity
app.use("/", userRoutes); // for login, register, logout
app.use("/campgrounds", campgroundRoutes); // for campground-related routes
app.use("/campgrounds/:id/review", reviewRoutes); // for reviews nested under campgrounds

// =============== HOME PAGE ROUTE ===============
app.get("/", (req, res) => {
  res.render("home"); // renders views/home.ejs
});

// =============== ERROR HANDLING ===============

// Catch-all route for undefined routes (triggers 404 error)
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); // custom error with 404 code
});

// Global error handler middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // default status 500
  if (!err.message) err.message = "OHHH  NO, SOMETHING WENT WRONG!!!!"; // fallback message
  res.status(statusCode).render("error", { err }); // show error.ejs template
});

// =============== START SERVER ===============
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Login Port:${port}`); // Start server on port 3000
});
