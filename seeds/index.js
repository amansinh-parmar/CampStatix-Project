// API Key for fetch images
// const PEXELS_API_KEY =
//   "qf4WkaFrva8Ktd5ydWNa6hb9hvEAcFG9clJo8SLDVOQpZSyhObEeQqF6";

// =============== Connect to MongoDB ===============
const mongoose = require("mongoose");

// Import seed data (random city and state names)
// const cities = require("./copy_city"); // Optional alternative file
const cities = require("./cities");

// Import title generators (e.g., "Forest Creek", "Dusty Canyon")
const { places, descriptors } = require("./seedHelpers");

// Import Campground model to insert data into the database
const Campground = require("../models/campground");

// Connect to the local MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp-maptiler", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle connection events (log success or error)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!!");
});

// =============== Helper Function ===============
// Picks a random element from any given array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// =============== Seed the Database ===============
const seedDB = async () => {
  await Campground.deleteMany({}); // Clear existing campgrounds

  // Create 50 random campgrounds
  for (let i = 1; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * 500); // Get a random city
    const price = Math.floor(Math.random() * 20) + 10; // Generate a random price between 10 and 30

    // Create new campground object with random data
    const camp = new Campground({
      // author: "68ef8813ba23f5cc79ff2582",
      author: "",
      location: `${cities[randomIndex].city}, ${cities[randomIndex].state}`, // Random city, state
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      title: `${sample(descriptors)} ${sample(places)}`, // Random campground name
      // image: `https://picsum.photos/400?random=${Math.random()}`, // Random placeholder image
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto ex ducimus libero architecto, nulla sunt.",
      price, // Random price
      images: [
        {
          url: "https://res.cloudinary.com/dsveno5v2/image/upload/v1760698665/YelpCamp/nwhnerogylz8le3zrci4.jpg",
          filename: "YelpCamp/nwhnerogylz8le3zrci4",
        },
        {
          url: "https://res.cloudinary.com/dsveno5v2/image/upload/v1760698668/YelpCamp/hdjfadszupq9rgpazmpu.jpg",
          filename: "YelpCamp/hdjfadszupq9rgpazmpu",
        },
      ],
    });

    await camp.save(); // Save campground to the database
  }
};

// =============== Run Seeder and Close DB ===============
// Call the seeding function, then close the database connection
seedDB().then(() => {
  mongoose.connection.close(); // Close connection after seeding is done
});
