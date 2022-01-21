import User from './api/User';

export default function(token) {
	return {
		user: new User(token)
	}
}