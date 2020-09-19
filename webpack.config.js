const path = require('path');

module.exports = {
	entry: './js/_entry.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'js')
	}
}