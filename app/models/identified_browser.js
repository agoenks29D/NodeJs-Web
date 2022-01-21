module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			session_uid: {
				type: DataTypes.UUID,
				allowNull: true
			},
			device_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			uid: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			name: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			version: {
				type: DataTypes.STRING(20),
				allowNull: false
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'identified_device', foreignKey: 'device_id', targetKey: 'id' }, // identified_browser.device_id reference to identified_device.id
			{ type: 'belongsTo', model: 'visitor', foreignKey: 'session_uid', targetKey: 'session_uid' } // identified_browser.session_uid reference to visitor.session_uid
		]
	}
}
