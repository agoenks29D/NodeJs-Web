const express = require('express');
const router = express.Router();
const sha1 = require('crypto-js/sha1');

/**
 * ------------------------------------------------------------
 * route section | user auth
 * ------------------------------------------------------------
 */
router.route('/authentication/:type')
.post(async (req, res, next) => {
	if (req.params.type == 'sign-up') {
		res.json({ 'status': 'success' });
	} else if (req.params.type == 'sign-in') {
		var auth = req.body;
			auth = await Models.user.findOne({
			attributes: ['id', 'full_name', 'username'],
			where: {
				[DB.Op.or]: [
					{ email: auth.identity },
					{ username: auth.identity },
					{ phone: auth.identity }
				],
				password: sha1(auth.password).toString()
			}
		});

		if (auth !== null) {
			req.session.user_id = auth.id;
			res.json({ 'status': 'success', data: auth });
		} else {
			res.status(401).json({ 'status': 'failure' });
		}
	} else if (req.params.type == 'recover-account') {
	} else {
		next();
	}
})
.put((req, res, next) => {
	// reset password
});

/**
 * ------------------------------------------------------------
 * route section | user oauth
 * ------------------------------------------------------------
 */
router.route('/oauth/:option/:third_party')
.get((req, res, next) => {
	if (req.params.option == 'overview') {
		if (req.params.third_party !== undefined) {
			// third-party overview
		}
	} else if (req.params.option == 'callback') {
		// third-party oauth callback
	} else {
		next();
	}
});

/**
 * ------------------------------------------------------------
 * route section | user profile
 * ------------------------------------------------------------
 */
router.route('/profile/:uid?/:option?')
.get(async (req, res, next) => {
	if (req.params.uid !== undefined) {
		let data = await Models.user.findOne({
			attributes: { exclude: ['password'] },
			where: {
				[DB.Op.or]: [
					{ id: req.params.uid },
					{ username: req.params.uid }
				]
			},
			include: [
				{ model: Models.user_role }
			]
		});

		res.json({ status: 'success', data: data });
	} else {
		let data = await Models.user.findAll({
			attributes: { exclude: ['password'] },
			include: [
				{
					model: Models.user_role
				}
			]
		});

		res.json({ status: 'success', data: data });
	}
})
.put((req, res, next) => {
	// update
})
.patch((req, res, next) => {
	res.json({ 'status': 'success' });
});

/**
 * ------------------------------------------------------------
 * route section | user device
 * ------------------------------------------------------------
 */
router.route('/device/:option?/:uid')
.get((req, res, next) => {
	if (req.params.uid !== undefined) {
		// spesific device
	} else {
		// all devices
	}
})

.post((req, res, next) => {
	// add new device
})

.put((req, res, next) => {
	// replace device
})

.delete((req, res, next) => {
	if (req.params.uid !== undefined) {
		// spesific device
	} else {
		// all devices
	}
});

module.exports = router;
