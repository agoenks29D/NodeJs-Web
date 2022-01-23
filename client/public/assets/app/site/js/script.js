var WN = WebNode({
	ID: 'WN-1337', // Client ID
}).then(resource => {
	resource.Notification.registerPush();
}, console.log);
