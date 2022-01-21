import API from './Init';

class User extends API {
	constructor(token) {
		super();
	}

	identify(data) {
		return this.api.post('/api/v1/identify/session', data);
	}

	sign_in(identity, password) {
		return this.api.post('/api/v1/user/authentication/sign-in', { identity: identity, password: password });
	}
}

export default User;