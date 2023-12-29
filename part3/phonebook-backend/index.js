require('dotenv').config();
const express = require('express');
const Phonebook = require('./models/phonebook');
const morgan = require('morgan');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/api/persons', (req, res) => {
	Phonebook.find({}).then(response => {
		res.json(response);
	});
});

app.get('/api/persons/:id', (req, res) => {
	Phonebook.findById(req.params.id).then(result => res.json(result));
});

const getDate = () => {
	return new Date();
};

app.get('/info', (request, response) => {
	const date = getDate();
	let numberOfPersons = 0;
	axios
		.get('http://localhost:3001/api/persons')
		.then(result => {
			numberOfPersons = result.data.length;
			response.send(
				`<p>Phonebook has info for ${numberOfPersons} people</p><p>${date}</p>`
			);
		})
		.catch(err => {
			res.status(404).end();
			console.log(err);
		});
});

app.delete('/api/persons/:id', (req, res, next) => {
	Phonebook.findByIdAndDelete(req.params.id)
		.then(() => res.status(204).end())
		.catch(err => next(err));
});

app.post('/api/persons', (req, res, next) => {
	const newPerson = new Phonebook(req.body);
	newPerson
		.save()
		.then(() => {
			console.log(`added to phonebook`);
			res.json(newPerson);
		})
		.catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
	const updatedPerson = req.body;

	Phonebook.findByIdAndUpdate(req.params.id, updatedPerson, {
		new: true,
		runValidators: true,
		context: 'query',
	})
		.then(result => res.json(result))
		.catch(err => next(err));
});

const errorHandler = (error, request, response, next) => {
	console.error('aca esta', error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		console.log('llego hasta aca ya');
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
