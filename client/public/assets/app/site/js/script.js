var WN = WebNode({
	ID: 'WN-1337', // Client ID
}).then(resource => {
	resource.ServiceWorker.register(registration => {
		resource.ServiceWorker.webpush(registration).then(async subscription => {
			resource.RESTfulUser.notification.registerWebPush({
				device_id: await resource.Helpers.identification.device_id,
				subscription: subscription
			});
		}, console.log)
	});
}, console.log);
