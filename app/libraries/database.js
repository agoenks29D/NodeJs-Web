class Database {
	constructor(group) {
		if (group !== undefined) {
			if (Object.keys(Constants.DB_CONFIG).indexOf(group) !== -1) {
				this.active_database = Constants.DB_CONFIG[group];
			}
		} else {
			this.active_database  = Constants.DB_CONFIG[process.env.DB_ACTIVE];
		}
	}

	/**
	 * Initialize database group
	 *
	 * @param      {string}   group   Database group name
	 * @return     {Promise}
	 */
	init(group) {
		return new Promise(async (resolve, reject) => {
			if (this.active_database.dbdriver.toLowerCase().match(/(mongo|mongodb)/)) {
				this.mongodb(resolve, reject);
			} else if (this.active_database.dbdriver.toLowerCase().match(/(rethinkdb)/)) {
				this.rethinkdb(resolve, reject);
			} else if (this.active_database.dbdriver.toLowerCase().match(/(mysqli?)/)) {
				this.sequelize(resolve, reject);
			}
		});
	}

	/**
	 * MongoDB
	 *
	 * @param      {Function}  resolve  The resolve
	 * @param      {<type>}    reject   The reject
	 */
	mongodb(resolve, reject) {
		const { MongoClient } = require('mongodb');
		if (this.active_database.dsn !== '') {
			const DBConfig = new MongoClient(this.active_database.dsn, { useUnifiedTopology: true });
			DBConfig.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		} else {
			const DBConfig = new MongoClient('mongodb://'+this.active_database.host+':'+this.active_database.port, { useUnifiedTopology: true });
			DBConfig.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		}
	}

	/**
	 * RethinkDB
	 *
	 * @param      {Function}  resolve  The resolve
	 * @param      {Function}  reject   The reject
	 */
	rethinkdb(resolve, reject) {
		r = require('rethinkdb');
		r.connect({
			host: this.active_database.host,
			port: this.active_database.port,
			user: this.active_database.username,
			password: this.active_database.password,
			db: this.active_database.password
		}, (error, connection) => {
			if (error) {
				reject(error);
			}

			resolve({ driver: 'rethinkdb', active_database: this.active_database, connection: connection });
		});
	}

	/**
	 * Create database
	 *
	 * @param      {string}   [dbdriver='mysql']  DB Driver name
	 * @param      {object}   [config={}]         DB Config
	 * @return     {Promise}  true on success & false on failure
	 */
	createDB(dbdriver = 'mysql', config = {}) {
		return new Promise((resolve, reject) => {
			const { host, port, username, password, database, dbdriver } = config;
			if (dbdriver == 'mysql') {
				const mysql = require('mysql2/promise');
				mysql.createConnection({ host, port, user:username, password }).then(async (temp) => {
					await temp.connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
					resolve(true);
				}).catch(() => {
					resolve(false);
				});
			}
		});
	}

	/**
	 * Drop DB
	 *
	 * @param      {string}   [dbdriver='mysql']  DB Driver name
	 * @param      {object}   [config={}]         DB Config
	 * @return     {Promise}  true on success & false on failure
	 */
	dropDB(dbdriver = 'mysql', config = {}) {
		return new Promise((resolve, reject) => {
			const { host, port, username, password, database, dbdriver } = config;
			if (dbdriver == 'mysql') {
				const mysql = require('mysql2/promise');
				mysql.createConnection({ host, port, user:username, password }).then(async (temp) => {
					await temp.connection.promise().query(`DROP DATABASE IF EXISTS \`${database}\`;`);
					resolve(true);
				}).catch(() => {
					resolve(false);
				});
			}
		});
	}

	/**
	 * Sequelize
	 *
	 * @param      {Function}  resolve  The resolve
	 * @param      {Function}  reject   The reject
	 */
	async sequelize(resolve, reject) {
		var database_error = false;
		const { host, port, username, password, database, dbdriver } = this.active_database;
		if (Helpers.string.to_boolean(process.env.DB_DROP)) {
			await this.dropDB(dbdriver, this.active_database);
		}

		await this.createDB(dbdriver, this.active_database);

		const { Sequelize, Op, Model, DataTypes } = require('sequelize');
		const connection = new Sequelize.Sequelize(database, username, password, {
			host: host,
			port: (port !== 3306)?port:3306,
			dialect: dbdriver,
			logging: this.active_database.db_debug,
			timezone: this.active_database.timezone
		});

		// load models
		const models = require(__dirname+'/../models/');
		const models_name = Object.keys(models);

		for (var key = 0; key < models_name.length; key ++) {
			var name = models_name[key];
			var model = models[name](DataTypes);

			if (model.connections !== undefined && model.connections.indexOf(process.env.DB_ACTIVE) !== -1) {
				const dbprefix = (this.active_database.dbprefix !== undefined && this.active_database.dbprefix !== '')?this.active_database.dbprefix:'';
				name = (model.config !== undefined && model.config.modelName !== undefined)?model.config.modelName:name;
				connection.define(name, model.fields, Object.assign({
					tableName: dbprefix+name,
					freezeTableName: true,
					underscored: true,
					createdAt: 'created_at',
					updatedAt: 'updated_at',
					charset: 'utf8mb4',
					collate: 'utf8mb4_unicode_ci'
				}, model.config));
			}
		}

		for (var key = 0; key < models_name.length; key ++) {
			var name = models_name[key];
			var model = models[name](DataTypes);

			if (model.associate !== undefined && model.associate.length > 0) {
				model.associate.forEach((relation, key) => {
					// removing object keys : type & model to show associations config only
					var associate = model.associate.map((associate, k) => {
						var new_object = {}
						var object_keys  = Object.keys(associate);
						for (var i = 0; i < object_keys.length; i++) {
							if (['type', 'model'].indexOf(object_keys[i]) == -1) {
								new_object[object_keys[i]] = associate[object_keys[i]];
							}
						}

						return new_object;
					});

					connection.models[name][relation.type](connection.models[[model.associate[key].model]], associate[key]);
				});
			}
		}

		connection.sync({ [process.env.DB_MODE]: Helpers.string.to_boolean(process.env.DB_INIT) }).then((conn) => {
			global.Models = Object.assign(connection.models, global.Models);
			resolve({ driver: 'sequelize', active_database: this.active_database, connection: { connection, Sequelize, Op, Model, DataTypes } });
		}, (error) => {
			if (error.original !== undefined) {
				reject({
					code: error.original.code,
					message: error.original.sqlMessage,
					sql: error.original.sql
				});
			} else {
				reject(error);
			}
		});
	}
}

module.exports = Database;
