require('dotenv').config();

const mongoURL =
	process.env.NODE_ENV === 'test'
		? process.env.mongoURL
		: process.env.mongoURLtest;
const PORT = process.env.PORT;

module.exports = {
	mongoURL,
	PORT,
};
