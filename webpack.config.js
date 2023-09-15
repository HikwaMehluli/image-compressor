const path = require('path');
// const webpack = require('webpack');

module.exports = {
	// mode: env.production ? 'production' : 'development',
	// plugins: [
	// 	new webpack.ProvidePlugin({
	// 		$: 'jquery',
	// 		jQuery: 'jquery',
	// 		'window.jQuery': 'jquery'
	// 	}),
	// ],
	entry: './js/_entry.js',
	output: {
		path: path.resolve(__dirname, 'js'),
		filename: 'app.js'
	}
}