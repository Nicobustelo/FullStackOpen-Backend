require('dotenv').config();
const express = require('express');
const Phonebook = require('./models/phonebook');
const morgan = require('morgan');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/api/persons', (req, res) => {
	Phonebook.find({}).then(response => {
		res.json(response);
	});
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(p => p.id === id);

	if (!person) {
		response.status(404).end();
	} else {
		response.json(person);
	}
});

const getDate = () => {
	return new Date();
};

app.get('/info', (request, response) => {
	const date = getDate();
	response.send(
		`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
	);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(p => p.id !== id);

	response.status(204).end();
});

function generateId(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/api/persons', (req, res) => {
	const newPerson = new Phonebook(req.body);
	newPerson.save().then(() => {
		console.log(`added to phonebook`);
	});
	res.json(newPerson);
});

// app.post('/api/persons', (request, response) => {
// 	const person = request.body;
// 	const id = generateId(persons.length, 1000);
// 	console.log('person ', request.body);
// 	console.log('id ', id);
// 	person.id = id;

// 	if (!person.name || !person.number) {
// 		return response.status(400).json({
// 			error: 'name or number missing',
// 		});
// 	} else if (persons.map(p => p.name).includes(person.name)) {
// 		return response
// 			.status(400)
// 			.json({ error: 'Name is already in the phonebook' });
// 	} else {
// 		persons = persons.concat(person);
// 		response.json(person);
// 	}
// });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
