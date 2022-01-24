import User from './api/User';
import Notification from './api/Notification';

export default function(token) {
	return {
		user: new User(token),
		notification: new Notification(token)
	}
}
