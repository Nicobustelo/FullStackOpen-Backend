const logger = require('./utils/logger.js');
const app = require('./app.js');
const { PORT } = require('./utils/config.js');

app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});
