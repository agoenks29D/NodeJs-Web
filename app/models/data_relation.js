module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			resource_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			left_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			right_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			}
		},
		config: {
			paranoid: true
		}
	}
}
