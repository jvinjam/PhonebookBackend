const express = require('express')
const app = express()

// Import environment variables from.env file
require('dotenv').config()

const Person = require('./models/person')

//to serve static files from the build folder of frontend
app.use(express.static('dist'))
//const path = require('path');
// app.use(express.static(path.join(__dirname, 'dist')));

const cors = require('cors')
const morgan = require('morgan')
// Middleware for parsing JSON request bodies
morgan.token('body', function (req) {
  if ('POST'.includes(req.method))
    return JSON.stringify(req.body)
  else
    return ''
})

app.use(cors())
app.use(express.json())

// Middleware for logging HTTP requests
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
// app.use(morgan('tiny'))

// Get all persons from the database
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// Summary of persons application endpoint
app.get('/info', (request, response, next) => {
  const currentDate = new Date()
  // Use toString() to get the desired format
  const formattedDate = currentDate.toString()

  Person.countDocuments()
    .then((count) => {
      response.send(`<div>Phonebook has info for ${count} people</div>
        <br/>
        <div>${formattedDate}</div>`)
    })
    .catch((error) => next(error))
})

// Get a single person by ID from the database
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

// Delete a person by ID from the database and return 204 No Content status code
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Create a new person to the database and return the created person as JSON
app.post('/api/persons', (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })
  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => {
      next(error)
    }) // Handle Mongoose validation errors separately);
})

// Update an existing person by ID in the database and return the updated person as JSON
app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number,
  }
  Person.findByIdAndUpdate(request.params.id, newPerson, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => {
      console.log('update err: ', error.message)
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// Handle errors for all routes that are not defined
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
// Middleware for error handling
app.use(errorHandler)

// Catch-all route to send back index.html for SPA routing (important for React, Angular, etc.)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// Start the server and log its port number to the console
const PORT = process.env.PORT
//process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
