// load dotenv
require('dotenv').config();

// define required packages
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http').createServer(app);
const async = require('async');
const flash = require('connect-flash');
const underscore = require('underscore');
const request_ip = require('request-ip');
const compression = require('compression');
const body_parser = require('body-parser');
const http_errors = require('http-errors');
const cookie_parser  = require('cookie-parser');
const express_session = require('express-session');
const express_socketio_session = require('express-socket.io-session');
const winston = require('winston');
const FileStore = require('session-file-store')(express_session);
const session = express_session({
	store: new FileStore(),
	secret: process.env.ENCRYPTION_KEY,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false, maxAge: Date.now() + (30 * 86400 * 1000) }
});
const io = require('socket.io')(http, { path: '/ws' });
const moment_timezone = require('moment-timezone');
const moment_duration = require('moment-duration-format');
const i18next = require('i18next');
const i18next_backend = require('i18next-fs-backend');

// initialize i18next for multi language
i18next
.use(i18next_backend)
.init({
	initImmediate: false,
	fallbackLng: 'eng',
	lng: 'eng',
	debug: false,
	ns: 'web',
	defaultNS: 'web',
	saveMissing: true,
	updateMissing: true,
	saveMissingTo: 'current',
	preload: fs.readdirSync(path.join(__dirname+'/client/public/assets', 'languages')).filter((fileName) => {
		const joinedPath = path.join(path.join(__dirname+'/client/public/assets', 'languages'), fileName)
		const isDirectory = fs.lstatSync(joinedPath).isDirectory()
		return isDirectory
	}),
	backend: {
		addPath : path.join(__dirname+'/client/public/assets', 'languages/{{lng}}/{{ns}}.json'), // addPath for save missing language key
		loadPath: path.join(__dirname+'/client/public/assets', 'languages/{{lng}}/{{ns}}.json') // loadPath for saved language key
	}
}, (error, t) => global.lang = t); // assign i18next to global variable

io.use(express_socketio_session(session, { autoSave: true })); //socket.io session

// define global variable
global.r;
global._ = underscore;
global.io = io;
global.acl = require('acl');
global.Joi = require('joi');
global.moment = require('moment');
global.webpush = require('web-push');
moment.tz.setDefault(process.env.TIMEZONE || 'Asia/Jakarta');
webpush.setVapidDetails('mailto:'+process.env.DEVELOPER_MAIL, process.env.publicVapidKey, process.env.privateVapidKey);

global.DB;
global.Models;
global.Constants = {
	BASE_PATH: __dirname,
	VIEW_PATH: __dirname+'/app/views',
	PUBLIC_PATH: __dirname+'/client/public/',
	DB_CONFIG: require(__dirname+'/database.json')
}
global.Helpers = require(__dirname+'/app/helpers');
global.Engines = require(__dirname+'/app/engines');

async.waterfall([
	function (callback) {
		var database;

		const SQL_DB_SUPPORT = /(mysqli?|maria(db)?|postgre(sql)?s?|sqlite3?)/;
		const NoSQL_DB_SUPPORT = /(mongo(db)?|rethink(db)?)/;
		if (process.env.DB_ENABLE) {
			const DB_DEFAULT = Constants.DB_CONFIG[process.env.DB_ACTIVE];

			if (DB_DEFAULT.dbdriver.match(SQL_DB_SUPPORT)) {
				database = require(__dirname+'/app/libraries/sql_db');
				database = new database(process.env.DB_ACTIVE);
				database.init().then(initialize_database => callback(null, initialize_database), error => callback(error)); // Initialize database config
			} else if (DB_DEFAULT.dbdriver.match(SQL_DB_SUPPORT)) {
				database = require(__dirname+'/app/libraries/no_sql_db');
				database = new database(process.env.DB_ACTIVE);
				database.init().then(initialize_database => callback(null, initialize_database), error => callback(error)); // Initialize database config
			}
		} else {
			callback(null);
		}
	},
	function(params, callback) {
		if (process.env.DB_ENABLE) {
			if (params.active_database.driver == 'mongodb') {
				callback(null, {driver: params.driver, active_database: params.active_database, database: params.connection.db(params.active_database.database)}); // Activation current database
			} else {
				callback(null, {driver: params.driver, active_database: params.active_database, database: params.connection}); // Activation current database
			}
		} else {
			if (typeof callback == 'function') {
				callback(null);
			} else {
				params(null);
			}
		}
	},
	function(params, callback) {
		callback(null, params)
	}
], function (error, result) {
	if (error) {
		console.log(error);
		process.exit(0);
	} else {
		if (process.env.DB_ENABLE) {
			DB = result.database; // define active database connection as global variable

			Models.user.count().then(async length => {
				if (length < 1) {
					var total_user_role = await Models.user_role.count();
					if (total_user_role < 1) {
						var user_role = await Models.user_role.create({
							name: 'ADMIN',
							description: 'The administrator app user group',
							status: 'active'
						});
					} else {
						var user_role = await Models.user_role.findOne();
					}

					const sha1 = require('crypto-js/sha1');
					await Models.user.create({ role_id: user_role.id, full_name: 'ADMIN', username: 'admin', password: sha1('admin').toString() });
				}
			});

			if (process.env.DB_INIT) {
				var file_content = fs.readFileSync(__dirname+'/.env', 'utf8');
				process.env.DB_INIT = false;
				file_content = file_content.replace('DB_INIT = true', 'DB_INIT = false');
				file_content = file_content.replace('DB_MODE = force', 'DB_MODE = alter');
				fs.writeFileSync(__dirname+'/.env', file_content);
			}
		}
	}
});

global.Middlewares = require(__dirname+'/app/middlewares');
global.Sockets = require(__dirname+'/app/sockets');

app.set('views', Constants.VIEW_PATH);
app.set('view engine', 'twig');

// set express middlewares
app.set('trust proxy', 1);
app.use(
	session,
	flash(),
	express.json(),
	express.urlencoded({ extended: true }),
	express.static(__dirname+'/client/public'),
	request_ip.mw(),
	cookie_parser(process.env.ENCRYPTION_KEY),
	cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }),
	compression(),
	Middlewares.user.session_redirect,
	Middlewares.user.profile
);

const twig_render = (req, res, file, options = {}) => {
	Object.assign(options, res.locals); // merge option variable to local variable
	const twig = new Engines.twig([ { name: 'site', path: Constants.VIEW_PATH+'/site/' }, { name: 'user', path: Constants.VIEW_PATH+'/user/' } ]); // assign template paths

	// register twig filter
	twig.addFilter('map_merge', (array_object, new_item) => {
		if (new_item.has(0)) {
			new_item.forEach((value, key, map) => {
				array_object.set(array_object.size, value);
			});
		} else {
			array_object.set(array_object.size, new_item);
		}

		return Promise.resolve(array_object);
	});

	// register twig functions
	twig.addFunction('lang', (key) => {
		return Promise.resolve(lang(key));
	});

	// render with twig
	twig.render(file, options).then(output => res.send(output), error => res.send(error));
}

app.use(Middlewares.analytic.user_identify, (req, res, next) => {
	// set local app info
	res.locals.app = {
		name: process.env.APP_NAME,
		version: process.env.APP_VERSION,
		vendor: process.env.APP_VENDOR
	}

	res.locals.req = {
		original_url: req.originalUrl
	}

	res.render = (file, options) => twig_render(req, res, file, options);

	next();
});

/**
 * Site routing
 */
app.use('/',
	express.Router().use('/', require(__dirname+'/app/routes/site/index'))
);

/**
 * API routing
 */
app.use('/api',
	express.Router().use('/v1/site', require(__dirname+'/app/routes/api/v1/site')),
	express.Router().use('/v1/user', require(__dirname+'/app/routes/api/v1/user')),
	express.Router().use('/v1/identify', require(__dirname+'/app/routes/api/v1/identify')),
	express.Router().use('/v1/notification', require(__dirname+'/app/routes/api/v1/notification'))
);

/**
 * User routing
 */
app.use('/user',
	express.Router().use('/', require(__dirname+'/app/routes/user/index'))
);


// handle route not found
app.use(function (req, res, next) {
	next(http_errors(404));
});

// handle error
app.use((error, req, res, next) => {
	error_status = error.status || 500;
	error_message = error.message;

	res.render = (file, options) => twig_render(req, res, file, options);

	if (!res.headersSent) {
		const error_match = {
			api: /\/api\/v([1-9]\d*(\.\d+)?|\w+|.*)/,
			user: /^\/user(\/)?.*/
		}

		if (req.originalUrl.match(error_match.api)) {
			res.json({ status: 'error', message: 'not-found' });
		} else if (req.originalUrl.match(error_match.user)) {
			res.render('@user/error.twig', {
				error: error,
				page_attributes: {
					name: lang('error')
				}
			});
		} else {
			res.render('@site/error.twig', {
				error: error,
				page_attributes: {
					name: lang('error')
				}
			});
		}
	}
});

http.listen(process.env.PORT || 8080);
