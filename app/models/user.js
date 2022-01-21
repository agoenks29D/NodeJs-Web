module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			role_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING(40),
				allowNull: true
			},
			phone: {
				type: DataTypes.STRING(18),
				allowNull: true
			},
			username: {
				type: DataTypes.STRING(16),
				allowNull: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true
			},
			full_name: {
				type: DataTypes.STRING(80),
				allowNull: false
			},
			birthday: {
				type: DataTypes.DATEONLY,
				allowNull: true
			},
			country: {
				type: DataTypes.INTEGER(3),
				allowNull: true
			},
			region: {
				type: DataTypes.INTEGER(4),
				allowNull: true
			},
			city: {
				type: DataTypes.INTEGER(6),
				allowNull: true
			},
			address: {
				type: DataTypes.STRING,
				allowNull: true
			},
			gender: {
				type: DataTypes.ENUM('male', 'female'),
				allowNull: true
			}
		},
		associate: [
			{ type: 'hasMany', model: 'post', foreignKey: 'author' }, // user.id has many post.author
			{ type: 'hasMany', model: 'user_device', foreignKey: 'user_id' }, // user.id has many user_device.user_id
			{ type: 'hasMany', model: 'privilege', foreignKey: 'user_id' }, // user.id has many privilege.user_id
			{ type: 'hasMany', model: 'webpush', foreignKey: 'user_id' }, // user.id has many webpush.user_id
			{ type: 'belongsTo', model: 'user_role', foreignKey: 'role_id', targetKey: 'id' } // user.role_id belong to user_role.id
		],
		config: {
			paranoid: true
		}
	}
}
