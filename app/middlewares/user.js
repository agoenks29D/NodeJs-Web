
/**
 * Session redirect user
 *
 * @param      {object}    req     The request
 * @param      {object}    res     The resource
 * @param      {Function}  next    The next
 */
module.exports.session_redirect = (req, res, next) => {
	if (req.originalUrl.match(/^\/user(\/)?.*/)) {
		var auth_pages = /\/(sign-in|sign-up|forgot-password|recover-account|confirm-code)\/?/;
		if (typeof req.session.user_id == 'undefined') {
			if (req.originalUrl.match(auth_pages) == null && req.originalUrl.match(/(.*)\/api\/v\d{1,2}\/(.*)/) == null) {
				req.flash('redirected', true);
				res.status(401);
				res.redirect('/user/sign-in');
			} else {
				next();
			}
		} else {
			if (req.originalUrl.match(auth_pages) !== null) {
				res.redirect('/user');
			} else {
				next();
			}
		}
	} else {
		next();
	}
}

/**
 * Get user profile by session
 *
 * @param      {object}    req     The request
 * @param      {object}    res     The resource
 * @param      {Function}  next    The next
 */
module.exports.profile =  async (req, res, next) => {
	if (req.session.user_id !== undefined) {
		req.user = await Models.user.findOne({ where: { id: req.session.user_id } });
		res.locals.user = req.user;
	}

	next();
}

/**
 * ACL middleware
 *
 * @param      {string} 		resource     Resource name
 * @param      {string|array}  	permissions  Permissions name
 */
module.exports.acl = (resource, permissions) => {
	return (req, res, next) => next();
}
