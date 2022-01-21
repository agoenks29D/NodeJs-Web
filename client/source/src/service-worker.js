/**
 * NodeWeb Service Worker
 *
 * @version 1.0.0
 * @package NodeWeb Browser Module
 * @subpackage Service Worker
 * @author Agung Dirgantara <agungmasda29@gmail.com>
 *
 * Refrence :
 *
 * - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers (using service worker)
 * - https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope (service worker global scope)
 * - https://developer.mozilla.org/en-US/docs/Web/API/notification (notification)
 *
 * - https://developers.google.com/web/fundamentals/primers/service-workers (web fundamentals - service worker)
 * - https://developers.google.com/web/updates/2015/05/notifying-you-of-changes-to-notifications#serviceworkerregistrationgetnotifications (change notification)
 * - https://firebase.google.com/docs/reference/admin/node/admin.messaging.WebpushNotification
 */

'use strict';

let app = {
	name :'NodeWeb',
	version : '1.0.0',
	base_url : 'SERVER_URL'
}

class FeedBack {
	constructor() {
		this.base_url = app.base_url;
	}

	async request(path = '', method = 'GET', data = {}) {
		const response = await fetch(this.base_url+path, {
			method: method, // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data) // body data type must match "Content-Type" header
		});

		return response; // parses JSON response into native JavaScript objects
	}

	send(data) {
		this.request('/api/v1/notification/feedback', 'POST', data);
	}
}

var feedback = new FeedBack;

/**
 * service worker installation
 */
self.addEventListener('install', event => {
	console.log('installing '+app.name+' Service Worker Version : '+app.version);
	self.skipWaiting();
});

/**
 * service worker activation
 */
self.addEventListener('activate', event => {
	clients.claim();
});

/**
 * service worker listen to push event
 */
self.addEventListener('push', event => {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	var notification = JSON.parse(event.data.text());

	feedback.send({ event: 'received', notification: notification.options.data });
	self.registration.showNotification(notification.title, notification.options);
});

/**
 * notification click event
 *
 * 1. service worker receive push notification
 * 2. notification showing
 * 3. notification clicked
 */
self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	event.waitUntil(
		clients.matchAll({
			type: 'window'
	}).then(function(clientList) {
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url == '/' && 'focus' in client) {
				return client.focus();
			}
		}

		if (event.action == '') {
			if (clients.openWindow) {
				if (event.notification.data !== undefined && event.notification.data !== null) {
					if (event.notification.data.open_url !== undefined) {

					}
				}
			}

			feedback.send({ event: 'clicked', notification: event.notification.data });
		} else {
			switch (event.action) {
				case 'action1':
				break;

				case 'action2':
				break;

				default:
					event.notification.close();
				break;
			}

			feedback.send({ event: 'clicked', action: event.action, notification: event.notification.data });
		}
	}));
});

/**
 * notification close event
 *
 * 1. service worker receive push notification
 * 2. notification showing
 * 3. notification closed
 */
self.addEventListener('notificationclose', function(event) {
	feedback.send({ event: 'closed', notification: event.notification.data });
});

self.addEventListener('message', event => {
	console.log(event);
});
