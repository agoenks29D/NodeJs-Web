module.exports = function(DataTypes) {
	return {
		connections: [process.env.DB_ACTIVE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			chat_room_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			participant_id: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: false
			},
			text: {
				type: DataTypes.STRING,
				allowNull: true
			},
			attachment: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		associate: [
			{ type: 'belongsTo', model: 'chat_room', foreignKey: 'chat_room_id', targetKey: 'id' }, // chat_message.chat_room_id reference to chat_room.id
			{ type: 'belongsTo', model: 'chat_participant', foreignKey: 'participant_id', targetKey: 'id' } // chat_message.participant_id reference to chat_participant.id
		],
		config: {
			paranoid: true
		}
	}
}
