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
				allowNull: true
			},
			path: {
				type: DataTypes.STRING,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false
			},
			size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			mime: {
				type: DataTypes.STRING,
				allowNull: false
			},
			extension: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.TEXT('tiny'),
				allowNull: false
			},
			author_type: {
				type: DataTypes.ENUM('visitor', 'guest', 'user'),
				allowNull: true
			},
			author: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'acl_resource', foreignKey: 'resource_id', targetKey: 'id' } // file.resource_id reference to acl_resource.id
		],
		config: {
			paranoid: true
		}
	}
}
