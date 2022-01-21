/**
 * XHR
 *
 * @param      {object}    req     The request
 * @param      {object}    res     The resource
 * @param      {Function}  next    The next
 */
module.exports.xhr = (req, res, next) => {
	const app = require('express')();
	if (app.get('env') == 'production') {
		if (!req.xhr) {
			res.status(404).end();
		} else {
			next();
		}
	} else {
		next();
	}
}
