class NoSQL_DB {
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
	 * Initialize database
	 *
	 * @param      {string}   group   Database group name
	 * @return     {Promise}
	 */
	init(group) {
		return new Promise((resolve, reject) => {
			const { host, port, username, password, database, dbdriver } = this.active_database;
			if (dbdriver.match(/mongo(db)?/)) {
				this.mongodb(resolve, reject);
			} else if (dbdriver.match(/rethink(db)?/)) {
				this.rethinkdb(resolve, reject);
			} else {
				reject({ code: 400, message: 'invalid DB Driver for NoSQL DB' });
			}
		});
	}

	/**
	 * MongoDB
	 *
	 * @param      {Function} 	resolve  Promise resolve
	 * @param      {Function} 	reject   Promise reject
	 */
	mongodb(resolve, reject) {
		const { MongoClient } = require('mongodb');
		if (this.active_database.dsn !== '') {
			const MongoDB = new MongoClient(this.active_database.dsn, { useUnifiedTopology: true });
			MongoDB.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		} else {
			const MongoDB = new MongoClient('mongodb://'+this.active_database.host+':'+this.active_database.port, { useUnifiedTopology: true });
			MongoDB.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		}
	}

	/**
	 * RethinkDB
	 *
	 * @param      {Function}  resolve  Promise resolve
	 * @param      {Function}  reject   Promise reject
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
}

module.exports = NoSQL_DB;