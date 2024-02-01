const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const mongoose = require('mongoose');

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({});
	res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
	const blog = new Blog(req.body);

	await blog.save();
	res.status(201).json(blog);
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
