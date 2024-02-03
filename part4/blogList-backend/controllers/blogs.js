const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
	res.json(blogs);
});

const getTokenFrom = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

blogsRouter.post('/', async (req, res) => {
	const newBlog = req.body;

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}
	const user = await User.findById(decodedToken.id);

	newBlog.user = user._id;

	const blog = new Blog(newBlog);

	const savedBlog = await blog.save();

	user.blogs = user.blogs.concat(savedBlog.id);
	await user.save();

	res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
		if (!isValidObjectId) {
			return res.status(400).json({ error: 'Invalid blog ID' });
		}

		console.log('trying to delete');
		await Blog.findByIdAndDelete(id);
		console.log('successfully deleted');
		res.status(204).end();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

blogsRouter.put('/:id', async (req, res) => {
	const id = req.params.id;
	const updatedBlog = req.body;

	const result = await Blog.findByIdAndUpdate(id, updatedBlog);
	res.json(result.body);
});

module.exports = blogsRouter;
