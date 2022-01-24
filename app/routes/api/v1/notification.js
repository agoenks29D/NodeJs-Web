const express = require('express');
const router = express.Router();
const sha1 = require('crypto-js/sha1');

router.route('/web-push/:option')
.get((req, res, next) => {
	if (req.params.option == 'subscription') {
		res.json({});
	} else {
		res.json(webpush.generateVAPIDKeys());
	}
})
.post(async (req, res, next) => {
	if (req.params.option == 'subscribe') {
		var subscription = Joi.object({
			device_id: Joi.string().label(lang('identification.device_id')),
			subscription: Joi.object({
				endpoint: Joi.string().label(lang('webpush.endpoint')).required(),
				expirationTime: Joi.any(),
				keys: Joi.any()
			})
		}).validate(req.body, { abortEarly: false });

		if (typeof subscription.error == 'undefined') {
			subscription = subscription.value;
			var sha1_uid = sha1(subscription.subscription.endpoint).toString();
			var device_registration = await Models.identified_device.findOne({
				where: {
					uid: subscription.device_id
				}
			});

			var webpush_registration = await Models.webpush.findOne({
				where: {
					sha1_uid: sha1_uid
				}
			});

			if (device_registration !== null) {
				var new_data = {
					session_uid: req.session.uid,
					device_id: device_registration.id,
					endpoint: JSON.stringify(subscription.subscription),
					sha1_uid: sha1_uid
				}

				if (req.session.user_id !== undefined) {
					new_data.user_id = req.session.user_id;
				}

				if (webpush_registration == null) {
					webpush_registration = await Models.webpush.create(new_data);
				}
			}

			res.json({ status: 'success' });
		} else {
			res.json({ status: 'error', data: subscription.error.details });
		}
	} else if (req.params.option == 'broadcast') {
		var subscription = await Models.webpush.findAll();
		subscription.forEach((val, key) => {
			webpush.sendNotification(JSON.parse(val.endpoint), JSON.stringify({
				title: 'Title',
				options: {
					body: 'Notification!'
				}
			})).then((sent) => console.log('SENT', sent), (error) => console.log('ERROR', error.statusCode));
		});
		res.json({});
	} else {
		next();
	}
});

router.route('/user/:uid?')
.get((req, res, next) => {

})
.post((req, res, next) => {

});



module.exports = router;
