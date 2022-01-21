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
			uid: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			type: {
				type: DataTypes.ENUM('tv', 'desktop', 'laptop', 'tablet', 'mobile', 'wear'),
				allowNull: true
			},
			is_browser: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			is_android: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			is_ios: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			os_name: {
				type: DataTypes.STRING(20),
				allowNull: true,
				defaultValue: false
			},
			os_version: {
				type: DataTypes.STRING(20),
				allowNull: true
			}
		},
		associate: [
			{ type: 'hasMany', model: 'identified_browser', foreignKey: 'device_id' }, // identified_device.id has many identified_browser.device_id
			{ type: 'belongsTo', model: 'visitor', foreignKey: 'session_uid', targetKey: 'session_uid' } // identified_device.session_uid reference to visitor.session_uid
		]
	}
}
