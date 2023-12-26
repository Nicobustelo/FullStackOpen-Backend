const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/api/persons', (request, response) => {
	response.json(persons);
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

app.post('/api/persons', (request, response) => {
	const person = request.body;
	const id = generateId(persons.length, 1000);
	console.log('person ', request.body);
	console.log('id ', id);
	person.id = id;

	if (!person.name || !person.number) {
		return response.status(400).json({
			error: 'name or number missing',
		});
	} else if (persons.map(p => p.name).includes(person.name)) {
		return response
			.status(400)
			.json({ error: 'Name is already in the phonebook' });
	} else {
		persons = persons.concat(person);
		response.json(person);
	}
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
