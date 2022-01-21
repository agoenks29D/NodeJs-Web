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
		var sha1_endpoint = sha1(req.body.subscription).toString();
		var webpush_registration = await Models.webpush_notification.findOne({
			where: {
				sha1_endpoint: sha1_endpoint
			}
		});

		if (webpush_registration == null) {
			webpush_registration = await Models.webpush_notification.create({ device_id: req.session.device_registration, sha1_endpoint: sha1_endpoint, endpoint: req.body.subscription });
		}

		res.json({});
	} else if (req.params.option == 'broadcast') {
		var subscription = await Models.webpush_notification.findAll();
		subscription.forEach((val, key) => {
			webpush.sendNotification(JSON.parse(val.endpoint), JSON.stringify({
				title: 'xxx',
				options: {
					body: 'xxx'
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
