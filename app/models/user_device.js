module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			user_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			device_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'user', foreignKey: 'user_id', targetKey: 'id' }, // user_device.user_id reference to user.id
			{ type: 'belongsTo', model: 'identified_device', foreignKey: 'device_id', targetKey: 'id' } // user_device.device_id reference to identified_device.id
		]
	}
}
