class SQL_DB {
	constructor(group) {
		if (group !== undefined) {
			if (Object.keys(Constants.DB_CONFIG).indexOf(group) !== -1) {
				this.active_database = Constants.DB_CONFIG[group];
				this.init(group);
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
		});
	}

	/**
	 * Create database
	 *
	 * @param      {string}   dbdriver 		DB Driver name
	 * @param      {object}   config		DB Config
	 * @return     {Promise}  true on success & false on failure
	 */
	createDB(dbdriver = 'mysql', config = {}) {
		return new Promise((resolve, reject) => {
			const { host, port, username, password, database, dbdriver, char_set, dbcollat } = config;
			if (dbdriver == 'mysql') {
				const mysql = require('mysql2/promise');
				mysql.createConnection({ host, port, user:username, password }).then(async (temp) => {
					await temp.connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET \`${char_set}\` COLLATE \`${dbcollat}\`;`);
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
	 * @param      {string}   dbdriver 		DB Driver name
	 * @param      {object}   config 	 	DB Config
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
}

module.exports = SQL_DB;