module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			parent: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			resource_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			}
		},
		associate: [
			{ type: 'hasMany', model: 'category', foreignKey: 'parent' }, // category.id has many category.parent (from parent to childrens)
			{ type: 'belongsTo', model: 'category', foreignKey: 'parent', targetKey: 'id' }, // category.parent reference to category.id (from children to parent)
			{ type: 'belongsTo', model: 'acl_resource', foreignKey: 'resource_id', targetKey: 'id' } // category.resource_id reference to acl_resource.id
		]
	}
}
