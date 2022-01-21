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
				allowNull: true
			},
			role_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			resource_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			permission_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			data_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'user', foreignKey: 'user_id', targetKey: 'id' }, // privilege.user_id reference to user.id
			{ type: 'belongsTo', model: 'user_role', foreignKey: 'role_id', targetKey: 'id' }, // privilege.role_id reference to user_role.id
			{ type: 'belongsTo', model: 'acl_resource', foreignKey: 'resource_id', targetKey: 'id' }, // privilege.resource_id reference to acl_resource.id
			{ type: 'belongsTo', model: 'acl_permission', foreignKey: 'permission_id', targetKey: 'id' } // privilege.permission_id reference to acl_permission.id
		]
	}
}
