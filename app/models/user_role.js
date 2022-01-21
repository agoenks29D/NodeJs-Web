module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(80),
				allowNull: false
			},
			description: {
				type: DataTypes.TEXT('tiny'),
				allowNull: true
			},
			status: {
				type: DataTypes.ENUM('active', 'non-active'),
				allowNull: false
			}
		},
		associate: [
			{ type: 'hasMany', model: 'privilege', foreignKey: 'role_id' } // user_role.id role has many privilege.role_id
		]
	}
}
