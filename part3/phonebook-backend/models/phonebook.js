const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGO_URI;

console.log('connecting to Mongo:', url);

mongoose
	.connect(url)
	.then(result => {
		console.log('connected to MongoDB');
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message);
	});

const phoneNumberValidator = value => {
	// Regular expression to match the desired format
	const phoneNumberRegex = /^[0-9]{2,3}-[0-9]+$/;

	// Check if the value matches the regular expression
	return phoneNumberRegex.test(value);
};

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
	},
	number: {
		type: String,
		validate: {
			validator: phoneNumberValidator,
			message:
				'Invalid phone number format. Use the format XX-XXXXXXX or XXX-XXXXXXX.',
		},
		minLength: 8,
		required: true,
	},
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Phonebook', personSchema);
