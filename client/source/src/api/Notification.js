import API from './Init';

class Notification extends API {
	constructor(token) {
		super();
	}

	registerWebPush(request) {
		return this.api.post('/api/v1/notification/web-push/subscribe', request);
	}
}

export default Notification;
