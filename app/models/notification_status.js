module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			notification_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			role_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			user_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			received: {
				type: DataTypes.BOOLEAN,
				allowNull: true
			},
			read: {
				type: DataTypes.BOOLEAN,
				allowNull: true
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'notification', foreignKey: 'notification_id', targetKey: 'id' }, // notification_status.notification_id reference to notification.id
			{ type: 'belongsTo', model: 'user_role', foreignKey: 'role_id', targetKey: 'id' }, // notification_status.role_id reference to user_role.id
			{ type: 'belongsTo', model: 'user', foreignKey: 'user_id', targetKey: 'id' } // notification_status.user_id reference to user.id
		]
	}
}
