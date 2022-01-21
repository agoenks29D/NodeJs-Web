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
				unique: true,
				defaultValue: DataTypes.UUIDV1()
			},
			referer: {
				type: DataTypes.STRING,
				allowNull: true
			},
			is_bot: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			ip_address: {
				type: DataTypes.STRING(15),
				allowNull: false
			},
			country: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			region: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			city: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			time: {
				type: DataTypes.TIME,
				allowNull: false
			}
		},
		associate: [
			{ type: 'hasMany', model: 'identified_device', foreignKey: 'session_uid', targetKey: 'session_uid' } // visitor.session_uid reference to identified_device.session_uid
		]
	}
}
