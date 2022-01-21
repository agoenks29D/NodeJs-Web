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
				allowNull: true
			},
			user_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			}
		},
		associate: [
			{ type: 'hasMany', model: 'notification_status', foreignKey: 'notification_id' }, // notification.id has many notification_status.notification_id
			{ type: 'belongsTo', model: 'user_role', foreignKey: 'role_id', targetKey: 'id' }, // notification.role_id reference to user_role.id
			{ type: 'belongsTo', model: 'user', foreignKey: 'user_id', targetKey: 'id' } // notification.user_id reference to user.id
		]
	}
}
