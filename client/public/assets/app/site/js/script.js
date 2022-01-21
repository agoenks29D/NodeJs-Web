var WN = WebNode({
	ID: 'WN-1337', // Client ID
	API: {
		NOTIFICATION: false,
		CHAT: false
	},
	TYPE: 'GUEST',
	CHAT: {
		title: 'Chat Desks',
		placeholder: 'Write your message'
	}
});

WN.then(resource => {
	resource.Notification.registerPush();
}, console.log);