if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ quiet: true });
}

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

async function findCodinates() {
  const geoData = await maptilerClient.geocoding.forward("New York");
  // console.log(geoData);
  // use 'features' to get index with the particular location
  console.log(geoData.features[0]);
}

findCodinates();
