// =============== Import Required Modules ===============
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Passport.js plugin for handling authentication (adds username, hash & salt automatically)
const passportLocalMongoose = require("passport-local-mongoose");

// Optional: You imported passport here, but it's not used directly in this file
// You can remove it if you want, or keep it for clarity
const passport = require("passport");

// =============== Define User Schema ===============
const UserSchema = new Schema({
  // 'email' field is required and must be unique for each user
  email: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate emails in the database
  },
  // NOTE: You don't need to manually add 'username' and 'password' fields
  // because the passportLocalMongoose plugin will automatically add them
});

// =============== Add Passport Plugin ===============
// This plugin adds:
// - username & hashed password fields
// - authentication methods like `.register()`, `.authenticate()`, `.serializeUser()` etc.
UserSchema.plugin(passportLocalMongoose);

// =============== Export User Model ===============
// This will create a 'users' collection in MongoDB
module.exports = mongoose.model("User", UserSchema);
