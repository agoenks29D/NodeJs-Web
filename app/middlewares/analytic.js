const express_useragent = require('express-useragent');

/**
 * User identify
 *
 * @param      {object}    req     The request
 * @param      {object}    res     The resource
 * @param      {Function}  next    The next
 */
module.exports.user_identify = (req, res, next) => {
	var user = req.session.user_id;
	var guest = req.session.guest_id;
	var visitor = req.session.visitor_id;
	var visitor_agent = express_useragent.parse(req.headers['user-agent']);

	res.locals.analytic = new Object;

	if (typeof user == 'undefined') {
		if (typeof guest == 'undefined') {
			if (typeof visitor == 'undefined') {
				// create new visitor
				Models.visitor.create({
					referer: req.headers.referer,
					is_bot: visitor_agent.isBot,
					ip_address: req.clientIp,
					date: moment().format('YYYY-MM-DD'),
					time: moment().format('HH:mm:ss')
				}).then(created => {
					req.session.visitor_id = created.id;
					visitor = created.id
					res.locals.analytic.visitor = created.id;
				});
			} else {
				// send visitor session
				res.locals.analytic.visitor = visitor;
			}
		} else {
			// send guest session
			res.locals.analytic.guest = guest;
		}
	} else {
		// send user session
		res.locals.analytic.user = user;
	}

	next();
}
