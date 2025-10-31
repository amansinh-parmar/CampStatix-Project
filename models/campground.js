// =============== Import Mongoose & Review Model ===============
const mongoose = require("mongoose");
const Review = require("./review"); // Required to delete reviews when a campground is deleted
const { func } = require("joi");

// Extract Schema class from mongoose (for cleaner code)
const Schema = mongoose.Schema;


// =============== Define Campground Schema ===============
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_250");
});


const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String, // Name of the campground
  images: [ImageSchema],
  // images: [{ url: String, filename: String }],
  price: Number, // Price per night
  description: String, // Description of the campground
  location: String, // Location of the campground
  // =============== Geometry Location Coordinates ===============
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  // =============== Store Author Info ===============
  // 'author' will reference a User who created this campground
  author: {
    type: Schema.Types.ObjectId, // ObjectId refers to a specific User
    ref: "User", // Reference the User model
  },

  // =============== Store Review References ===============
  // 'review' is an array of ObjectIds that reference Review documents
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Reference to the Review model
    },
  ],
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

// =============== Middleware to Delete Related Reviews ===============
// This runs AFTER a campground is deleted via findOneAndDelete()
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Delete all reviews whose _id is in the 'review' array of the deleted campground
    await Review.deleteMany({
      _id: { $in: doc.review }, // $in operator finds all matching _id values in the array
    });
    console.log("Deleted campground and related reviews:", doc);
  }
});

// =============== Export the Model ===============
// This makes the Campground model available to import in other files
module.exports = mongoose.model("Campground", CampgroundSchema);
