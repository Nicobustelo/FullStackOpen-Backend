require('dotenv').config();

const mongoURL =
	process.env.NODE_ENV === 'test'
		? process.env.mongoURLtest
		: process.env.mongoURL;
const PORT = process.env.PORT;

module.exports = {
	mongoURL,
	PORT,
};
