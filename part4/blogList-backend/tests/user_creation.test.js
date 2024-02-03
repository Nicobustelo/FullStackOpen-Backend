const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('invalid users are not created', () => {
	const initialUsers = [
		{
			username: 'Nicolas Bustelo',
			name: 'nicobustelo',
			blogs: [],
			id: '65be94760a5dbd8a49bafdd0',
		},
		{
			username: 'Ernesto Bustelo',
			name: 'ernesbustelo',
			blogs: [],
			id: '65be95e383165d4a14cb8087',
		},
	];

	beforeEach(async () => {
		await User.deleteMany({});
		let userObject = new User(initialUsers[0]);
		await userObject.save();
		userObject = new User(initialUsers[1]);
		await userObject.save();
	});

	test('no username provided', async () => {
		const invalidUser = { name: 'invalidUser', password: 'User invalido' };
		const result = await api.post('/api/users').send(invalidUser).expect(401);
		expect(result.body.error).toBe('no username provided');
	});

	test('no password provided', async () => {
		const invalidUser = { username: 'User invalido', name: 'invalidUser' };
		const result = await api.post('/api/users').send(invalidUser).expect(401);
		expect(result.body.error).toBe('no password provided');
	});

	test('username or password is not long enough', async () => {
		const invalidUser = {
			username: 'User invalido',
			name: 'invalidUser',
			password: 'no',
		};
		const result = await api.post('/api/users').send(invalidUser).expect(401);
		expect(result.body.error).toBe('username or password is to short');
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
