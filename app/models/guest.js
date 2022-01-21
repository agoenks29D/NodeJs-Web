module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			visitor_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING(80),
				allowNull: false
			},
			email: {
				type: DataTypes.STRING(80),
				allowNull: true
			},
			phone: {
				type: DataTypes.STRING(20),
				allowNull: true
			},
			whatsapp: {
				type: DataTypes.STRING(20),
				allowNull: true
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'visitor', foreignKey: 'visitor_id', targetKey: 'id' } // guest.visitor_id reference to visitor.id
		]
	}
}
