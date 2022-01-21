module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false
			},
			author: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false
			},
			slug: {
				type: DataTypes.STRING,
				allowNull: false
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'user', foreignKey: 'author', targetKey: 'id' } // post.author reference to user.id
		],
		config: {
			paranoid: true
		}
	}
}
