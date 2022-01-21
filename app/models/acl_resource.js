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
				type: DataTypes.STRING,
				allowNull: false
			},
			is_maintenance: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		associate: [
			{ type: 'hasMany', model: 'acl_permission', foreignKey: 'resource_id' } // acl_resource.id has many acl_permission.id (resouce/module has many permissions)
		],
		config: {
			paranoid: true
		}
	}
}
