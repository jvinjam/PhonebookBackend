// Import environment variables from.env file
require("dotenv").config();

// Import required modules
const mongoose = require("mongoose");
// Connect to MongoDB using environment variables
mongoose.set("strictQuery", false);

// Define the connection URL to MongoDB database
const url = process.env.MONGODB_URI;
console.log("connecting to", url);

// Connect to MongoDB
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Export the Person model
module.exports = mongoose.model("Person", personSchema);
