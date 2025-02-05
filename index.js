const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentDate = new Date();
  // Use toString() to get the desired format
  const formattedDate = currentDate.toString();

  response.send(`<div>Phonebook has info for ${persons.length} people</div>
    <br/>
    <div>${formattedDate}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    console.log(`Person with ${id} not found`)
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id != id)
  response.status(204).end()
})

const generateId = () => {
  let id = null
  while (true) {
    id = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))

    if (persons.find(p => p.id === id))
      continue
    else
      return id
  }
}

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  if (!name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!request.body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(p => p.name === name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    "id": generateId(),
    "name": name,
    "number": request.body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})