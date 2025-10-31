// =============== Import Required Modules ===============
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

// =============== Use 'MAPTILR' for getting geometry coordinates ===============
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

// =============== Controller for Campground to export for routes and routes export for app.js ===============
// =============== Index Router ===============
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds }); // Render 'index.ejs' with data
};

// =============== Render New Campground Template ===============
module.exports.randerNewForm = (req, res) => {
  res.render("campgrounds/new"); // Only accessible if user is logged in
};

// =============== Create New Router ===============
module.exports.createCampground = async (req, res, next) => {
  // Getting geometry coordinates
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  console.log(geoData);
  if (!geoData.features?.length) {
    req.flash(
      "error",
      "Could not geocode that location. Please try again and enter a valid location."
    );
    return res.redirect("/campgrounds/new");
  }

  // Create new campground using submitted form data
  const campground = new Campground(req.body.campground);

  // Geometry and Location
  campground.geometry = geoData.features[0].geometry;
  campground.location = geoData.features[0].place_name;

  // Take those user images and store in array in filename folder
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id; // Get user id from author for 'Campground'
  await campground.save(); // Save to MongoDB
  console.log("Uploaded files:", req.files);
  console.log("Campground images:", campground.images);

  console.log(campground);
  req.flash("success", "Successfully made a new campground!!");
  res.redirect(`/campgrounds/${campground._id}`); // Redirect to show page
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);
};

// =============== Render Show Campground Template ===============
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("author");
  // console.log(campground);
  // If campground doesn't exist, redirect back with error message
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("show", { campground }); // Render show.ejs
};

// =============== Render Edit Campground Template ===============
module.exports.randerEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground }); // Render edit form
};

// =============== Update Campground ===============
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  // Change Location
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  console.log(geoData);
  // console.log(geoData);
  if (!geoData.features?.length) {
    req.flash(
      "error",
      "Could not geocode that location. Please try again and enter a valid location."
    );
    return res.redirect(`/campgrounds/${id}/edit`);
  }

  // Use spread operator to update campground fields
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  // Update Geometry and Location
  campground.geometry = geoData.features[0].geometry;
  campground.location = geoData.features[0].place_name;

  // Take those user images and store in array in filename folder
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);

  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }

  console.log("Uploaded files:", req.files);
  console.log("Campground images:", campground.images);

  req.flash("success", "Successfully updated campground!!");
  res.redirect(`/campgrounds/${campground._id}`); // Redirect to updated campground page
};

// =============== Delete Campground ===============
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deleteCamp = await Campground.findByIdAndDelete(id); // Remove from DB
  req.flash("success", "Successfully deleted campground!!");
  res.redirect("/campgrounds"); // Redirect back to campgrounds list
};
