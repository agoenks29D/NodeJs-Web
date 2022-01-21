import String_ from '../helpers/String';
import App_ from '../helpers/App';

export default class ServiceWorker {

	#config;

	#available = false;

	#autenticated;

	constructor(config, autenticated) {
		this.#config = config;
		if ('serviceWorker' in navigator) {
			this.#available = true;
			this.#autenticated = autenticated;
		}
	}

	/**
	 * Register service worker
	 *
	 * @param      {Function}  callback  function callback
	 */
	register(callback) {
		if (this.#available) {
			var service_worker = '/ServiceWorker.default.js';
			navigator.serviceWorker.register(service_worker).then(async function(register) {
				var serviceWorker;
				if (register.installing) {
					serviceWorker = register.installing;
				} else if (register.waiting) {
					serviceWorker = register.waiting;
				} else if (register.active) {
					serviceWorker = register.active;
				}

				if (serviceWorker) {
					// service-worker already activated
					if (serviceWorker.state == 'activated') {
						App_.callback(callback, register);
					}

					serviceWorker.addEventListener('statechange', async function(event) {
						// service-worker just activated
						if (event.target.state == 'activated') {
							App_.callback(callback, register);
						}
					});
				}

				// service-worker has update
				register.addEventListener('updatefound', async () => {
					// just updated
					var new_udpate = register.installing;
					new_udpate.addEventListener('statechange', () => {
					});
				});
			});
		}
	}

	/**
	 * Register webpush
	 *
	 * @param      {object}   register  Service worker registration
	 * @return     {Promise}  true on success & false on failure
	 */
	webpush(register) {
		return new Promise((resolve, reject) => {
			if (this.#available) {
				register.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: String_.base64_to_int8_array(this.#autenticated.public_vapid_key)
				}).then(subscription => {
					$.ajax({
						url: this.#config.SERVER+'/api/v1/notification/web-push/subscribe',
						type: 'POST',
						dataType: 'JSON',
						data: { client: this.#config.ID, user_identify: this.#autenticated.user_identify, subscription: JSON.stringify(subscription) },
						success: () => resolve(true),
						error: () => resolve(false)
					});
				});
			} else {
				resolve(false);
			}
		});
	}

	/**
	 * Service worker send message
	 *
	 * @param      {mixed}  data
	 */
	send_message(data) {
		if (this.#available && navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(data);
		}
	}

	/**
	 * Service worker has control to page
	 *
	 * @return     {boolean}
	 */
	on_control() {
		return navigator.serviceWorker.controller;
	}

	/**
	 * Service worker receive message event
	 *
	 * @param      {Function}  callback  function callback
	 */
	on_message(callback) {
		if (this.#available) {
			navigator.serviceWorker.addEventListener('message', callback);
		}
	}
}
