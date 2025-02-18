const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
//const path = require('path');

// Import environment variables from.env file
require("dotenv").config();

const Person = require("./models/person");

app.use(express.json());
app.use(cors());
//to serve static files from the build folder of frontend
app.use(express.static("dist"));
// app.use(express.static(path.join(__dirname, 'dist')));

let persons = [];

// Middleware for parsing JSON request bodies
morgan.token("body", function (req, res) {
  if ("POST".includes(req.method)) return JSON.stringify(req.body);
  else return "";
});

// Middleware for logging HTTP requests
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
// app.use(morgan('tiny'))

// Get all persons from the database
app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Summary of persons application endpoint
app.get("/info", (request, response) => {
  const currentDate = new Date();
  // Use toString() to get the desired format
  const formattedDate = currentDate.toString();

  response.send(`<div>Phonebook has info for ${persons.length} people</div>
    <br/>
    <div>${formattedDate}</div>`);
});

// Get a single person by ID from the database
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// Delete a person by ID from the database and return 204 No Content status code
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id != id);
  response.status(204).end();
});

// Create a new person to the database and return the created person as JSON
app.post("/api/persons", (request, response) => {
  const name = request.body.name;
  const number = request.body.number;
  if (!name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  // if (persons.find((p) => p.name === name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Catch-all route to send back index.html for SPA routing (important for React, Angular, etc.)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// Start the server and log its port number to the console
const PORT = process.env.PORT;
//process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
