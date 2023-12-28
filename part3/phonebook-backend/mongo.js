const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

console.log(process.argv);

const password = process.argv[2];
const name = process.argv[3];
const number = Number(process.argv[4]);

const url = `mongodb+srv://nicobustelo:${password}@nodeexpressprojects.vzvl5fo.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
});

const Phonebook = new mongoose.model('Phonebook', personSchema);

if (process.argv.length === 3) {
	console.log('phonebook:');
	Phonebook.find({}).then(response => {
		response.forEach(p => {
			console.log(`${p.name} ${p.number}`);
		});
		mongoose.connection.close();
	});
} else {
	const person = new Phonebook({
		name,
		number,
	});

	person.save().then(() => {
		console.log(`added ${name}, number ${number} to phonebook`);
		mongoose.connection.close();
	});
}
