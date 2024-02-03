const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
	{
		title: 'La odisea de la vagancia',
		author: 'Nico Bustelo',
		url: 'example.com',
		likes: 50,
	},
	{
		title: 'Nuevo blog sin titulo',
		author: 'Algun autor',
		url: 'example2.com',
		likes: 100,
	},
];

beforeEach(async () => {
	await Blog.deleteMany({});
	let blogObject = new Blog(initialBlogs[0]);
	await blogObject.save();
	blogObject = new Blog(initialBlogs[1]);
	await blogObject.save();
});

test('returns correct amount of blog post', async () => {
	const response = await api.get('/api/blogs');
	expect(response.body).toHaveLength(2);
});

test('returns blogs in JSON format', async () => {
	await api.get('/api/blogs').expect('Content-Type', /application\/json/);
});

test('Unique identifier of blog post is named "id"', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body[0].id).toBeDefined();
});

test('HTTP POST successfully creates a new blog post', async () => {
	const newBlog = {
		title: 'Blog de prueba en test',
		author: 'Tester',
		url: 'test.com.ar',
		likes: 80,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(initialBlogs.length + 1);
});

test('likes property is missing from the request, default value should be 0', async () => {
	const newBlog = {
		title: 'Blog de prueba en test sin likes property',
		author: 'Tester without likes',
		url: 'test.com.ar',
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const result = await api.get('/api/blogs');
	expect(result.body).toHaveLength(initialBlogs.length + 1);
	expect(result.body[initialBlogs.length].likes).toBe(0);
});

test('if title or url properties are missing, backend responds with status code 400 Bad Request', async () => {
	const newNote = {
		author: 'Tester without title or url',
		likes: 80,
	};

	await api.post('/api/blogs').send(newNote).expect(400);
});

describe('deletion of a note', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		let response = await api.get('/api/blogs');

		console.log('GET blogs: ', response.body);

		const validID = response.body[0].id;

		await api.delete(`/api/blogs/${validID}`).expect(204);

		response = await api.get('/api/blogs');

		expect(response.body).toHaveLength(initialBlogs.length - 1);
	});
});

describe('updating individual post', () => {
	test('adding one to number of likes', async () => {
		let result = await api.get('/api/blogs');
		const validId = result.body[0].id;
		const updatedFirstBlog = {
			...result.body[0],
			likes: result.body[0].likes + 1,
		};

		await api.put(`/api/blogs/${validId}`).send(updatedFirstBlog).expect(200);

		result = await api.get('/api/blogs');
		expect(result.body[0].likes).toBe(initialBlogs[0].likes + 1);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
