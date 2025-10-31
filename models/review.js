// =============== Import Mongoose ===============
const mongoose = require("mongoose");

// Destructure Schema from mongoose to use for defining model structure
const { Schema } = mongoose;

// =============== Define Review Schema ===============
const reviewSchema = new Schema({
  // 'body' stores the text content of the review
  body: String,

  // 'rating' stores a numeric value (usually 1 to 5 stars)
  rating: Number,

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// =============== Export Review Model ===============
// This exports a Mongoose model named 'Review', using the reviewSchema
// It will create a 'reviews' collection in MongoDB (Mongoose pluralizes it automatically)
module.exports = mongoose.model("Review", reviewSchema);
