const path = require('path');
const jQuery = require('jquery');
const webpack = require('webpack');
const DotenvWebpack = require('dotenv-webpack');
const ReplacePlugin = require('webpack-plugin-replace');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const DotEnv = require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const protocol = (process.env.NODE_ENV == 'development')?'http://':'https://';

module.exports = (environment = 'development', env = {}, client_bundle = 'default', server_url = protocol+process.env.HOST+':'+process.env.PORT) => {

	environment = (environment.production == true)?'production':'development';

	let Web = {
		target: 'web',
		mode: environment,
		entry: path.resolve(__dirname, './src/App.js'),
		output: {
			path: path.resolve(__dirname, '../public/'),
			filename: 'App.'+client_bundle+'.js',
			library: 'WebNode',
			libraryTarget: 'umd',
			libraryExport: 'default',
			umdNamedDefine: true
		},
		plugins: [
			new DotenvWebpack({
				path: path.resolve(__dirname, '../../.env')
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			})
		],
		module: {
			rules: [
				{
					test: /(Init.js|App\.js)$/,
					use: StringReplacePlugin.replace({
						replacements: [
							{
								pattern: /SERVER_URL/gi,
								replacement: function (match, p1, offset, string) {
									return server_url;
								}
							}
						]
					})
				},
				{
					test: /\.(ogg|mp3|wav|mpe?g)$/i,
					exclude: /(node_modules|bower_components)/,
					loader: 'url-loader',
					options: {
						esModule: false
					}
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				}
			]
		},
		optimization: { minimizer: [] },
		performance: { hints: (environment.production == true) ? 'warning' : false }
	}

	let ServiceWorker = {
		target: 'web',
		mode: environment,
		entry: path.resolve(__dirname, './src/service-worker.js'),
		output: {
			path: path.resolve(__dirname, '../public/'),
			filename: 'ServiceWorker.'+client_bundle+'.js'
		},
		plugins: [],
		optimization: { minimizer: [] },
		module: {
			rules: [
				{
					test: /(service-worker\.js)$/,
					use: StringReplacePlugin.replace({
						replacements: [
							{
								pattern: /SERVER_URL/i,
								replacement: function (match, p1, offset, string) {
									return server_url;
								}
							}
						]
					})
				}
			]
		},
		optimization: { minimizer: [] },
		performance: { hints: (environment.production == true) ? 'warning' : false }
	}

	let RESTful = {
		target: 'web',
		mode: environment,
		entry: path.resolve(__dirname, './src/RESTful.js'),
		output: {
			path: path.resolve(__dirname, '../public/'),
			filename: 'RESTful.'+client_bundle+'.js',
			library: 'WebNodeAPI',
			libraryTarget: 'umd',
			libraryExport: 'default',
			umdNamedDefine: true
		},
		plugins: [],
		optimization: { minimizer: [] },
		performance: { hints: (environment.production == true) ? 'warning' : false }
	}

	if (environment == 'production') {
		// do for production
	}

	return [ Web, RESTful, ServiceWorker ];
}
