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
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required"],
  },
  // number: {
  //   type: String,
  //   required: true,
  //   minlength: 8,
  //   match: /^[0-9]{2,3}-[0-9]{5,}$/,
  // },
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
