require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json());

morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persones => {
    response.json(persones)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response) => {
  Person.deleteOne({ _id: request.params.id })
    .then((result) => {
      if (result.deletedCount === 0) {
        response.status(404).json({ errorMessage: 'Person no longer exists' })
      } else {
        response.status(204).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  const date = new Date();
  Person.countDocuments({}, (err, count) => {
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
  });
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });


  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error));
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
