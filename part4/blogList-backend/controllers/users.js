const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs', {
		url: 1,
		title: 1,
		author: 1,
	});
	res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
	const id = req.params.id;

	const user = await User.findById(id);
	res.json(user);
});

usersRouter.post('/', async (req, res) => {
	const { username, name, password } = req.body;

	if (!password) {
		res.status(401).json({
			error: 'no password provided',
		});
	} else if (!username) {
		res.status(401).json({
			error: 'no username provided',
		});
	} else if (username.length <= 3 || password.length <= 3) {
		res.status(401).json({
			error: 'username or password is to short',
		});
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();
	res.status(201).json(savedUser);
});

module.exports = usersRouter;
