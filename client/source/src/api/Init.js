const Axios = require('axios');

export default class Init {
	constructor() {
		this.api = Axios.create({
			baseURL: 'SERVER_URL'
		});
	}
}