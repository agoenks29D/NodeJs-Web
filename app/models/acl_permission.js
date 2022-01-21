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
			{ type: 'belongsTo', model: 'acl_resource', foreignKey: 'resource_id', targetKey: 'id' } // acl_permission.resource_id reference to acl_resource.id
		],
		config: {
			paranoid: true
		}
	}
}
