import { Manager } from 'socket.io-client';
import UAParser from 'ua-parser-js';
import FingerprintJs from '@fingerprintjs/fingerprintjs';
import Identification_ from '../helpers/Identification';
import Cookies_ from '../helpers/Cookies';
import String_ from '../helpers/String';
import RESTful from '../RESTful';

export default class Core {

	#api;

	#config;

	#socket;

	constructor(config) {
		this.init(config);
	}

	/**
	 * Initializes the given configuration.
	 *
	 * @param      {object}  config  The configuration
	 */
	init(config) {
		this.#config = {
		};

		if (typeof config == 'object') {
			this.#config = Object.assign(this.#config, config);
		}

		this.#socket = new Manager(this.#config.SERVER, { path: '/ws', transports: ['websocket', 'polling'] });
		this.#api = RESTful(localStorage.getItem('token'));
	}

	/**
	 * Authentication
	 *
	 * @return     {Promise}  session authentication
	 */
	auth() {
		const ua = new UAParser;
		return new Promise(async (resolve, reject) => {
			var browser = await FingerprintJs.load();
			browser = await browser.get();
			var data = {
				ID: this.#config.ID,
				TYPE: this.#config.TYPE,
				hostname: location.hostname,
				device: {
					id: await Identification_.device_id,
					type: await Identification_.device_type,
					os: {
						name: ua.getOS().name,
						version: ua.getOS().version
					},
					is_browser: true,
					is_private: await Identification_.is_private_browser,
					browser: {
						uid: browser.visitorId,
						name: ua.getBrowser().name,
						version: ua.getBrowser().version
					}
				}
			}

			this.#api.user.identify(data).then(response => resolve(response.data), error => reject(error));
		});
	}

	/**
	 * Get configuration
	 *
	 * @return     {object}
	 */
	config() {
		return this.#config;
	}

	/**
	 * Get socket.io class
	 *
	 * @return     {object}
	 */
	socket() {
		return this.#socket;
	}
}
