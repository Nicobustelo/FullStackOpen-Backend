const dummy = blogs => {
	return 1;
};

const totalLikes = blogs => {
	const blogsLikes = blogs.map(blog => blog.likes);
	return blogsLikes.reduce((a, b) => a + b, 0);
};

const favouriteBlog = blogs => {
	const blogsLikes = blogs.map(blog => blog.likes);
	console.log(blogsLikes);
	const maxLikes = Math.max(...blogsLikes);
	console.log(maxLikes);
	const favouriteBlogs = blogs.filter(
		blog => Number(blog.likes) === Number(maxLikes)
	);
	console.log(favouriteBlogs);

	return favouriteBlogs[0];
};

const mostBlogs = blogs => {
	const authorCount = {};

	blogs.forEach(blog => {
		const author = blog.author;
		authorCount[author] = (authorCount[author] || 0) + 1;
	});

	let maxAuthor = '';
	let maxCount = 0;

	for (const author in authorCount) {
		if (authorCount[author] > maxCount) {
			maxAuthor = author;
			maxCount = authorCount[author];
		}
	}

	return { author: maxAuthor, blogs: maxCount };
};

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs,
};
