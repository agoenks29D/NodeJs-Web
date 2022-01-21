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
			{ type: 'hasMany', model: 'tag', foreignKey: 'parent' }, // tag.id has many tag.parent (from parent to childrens)
			{ type: 'belongsTo', model: 'tag', foreignKey: 'parent', targetKey: 'id' }, // tag.parent reference to tag.id (from children to parent)
			{ type: 'belongsTo', model: 'acl_resource', foreignKey: 'resource_id', targetKey: 'id' } // tag.resource_id reference to acl_resource.id
		]
	}
}
