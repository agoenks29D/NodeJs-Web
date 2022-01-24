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
				allowNull: false
			},
			device_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			sha1_uid: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			endpoint: {
				type: DataTypes.TEXT('tiny'),
				allowNull: false
			},
			user_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			status: {
				type: DataTypes.ENUM('active', 'non-active', 'expired'),
				allowNull: false,
				defaultValue: 'active'
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'user', foreignKey: 'user_id', targetKey: 'id' }, // webpush.user_id reference to user.id
			{ type: 'belongsTo', model: 'identified_device', foreignKey: 'device_id', targetKey: 'id' }, // webpush.device_id reference to identified_device.id
			{ type: 'belongsTo', model: 'visitor', foreignKey: 'session_uid', targetKey: 'session_uid' } // webpush.session_uid reference to visitor.session_uid
		]
	}
}
