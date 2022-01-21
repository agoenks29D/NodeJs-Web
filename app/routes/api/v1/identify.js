const express = require('express');
const router = express.Router();

router.route('/session')
.post(async (req, res, next) => {
	var identification = Joi.object({
		ID: Joi.string().label(lang('identification.ID')).required(),
		hostname: Joi.string().label(lang('identification.hostname')).required(),
		device: Joi.object({
			id: Joi.string().label(lang('identification.device_id')).required(),
			type: Joi.string().label(lang('identification.device_type')).required(),
			os: Joi.object({
				name: Joi.string().label('identification.os_name').required(),
				version: Joi.string().label('identification.os_version').required()
			}).required(),
			is_browser: Joi.boolean().label(lang('identification.is_browser')).default(false),
			is_private: Joi.boolean().label(lang('identification.is_private')).default(false),
			browser: Joi.object({
				uid: Joi.string().label('identification.os_name').required(),
				name: Joi.string().label('identification.os_name').required(),
				version: Joi.string().label('identification.os_version').required()
			}),
		}).required(),
		user: Joi.object({
			token: Joi.string().required()
		})
	}).validate(req.body, { abortEarly: false });

	var device_registration = await Models.identified_device.findOne({
		where: {
			uid: req.body.device.id
		}
	});

	if (typeof identification.error == 'undefined') {

		var visitor_session = (req.session.visitor_id !== undefined)?await Models.visitor.findOne({ where: { id: req.session.visitor_id } }):null;
		if (visitor_session !== null) {
			visitor_session = visitor_session.get('session_uid');
		}

		identification = identification.value;

		if (device_registration == null) {
			device_registration = await Models.identified_device.create({
				session_uid: visitor_session,
				uid: identification.device.id,
				type: identification.device.type,
				is_browser: identification.device.is_browser,
				is_android: false,
				is_ios: false,
				os_name: identification.device.os.name,
				os_version: identification.device.os.version
			});
		}

		if (identification.device.is_browser) {
			var browser_registration = await Models.identified_browser.findOne({
				where: {
					device_id: device_registration.id,
					uid: identification.device.browser.uid,
					name: identification.device.browser.name
				}
			});

			if (browser_registration == null) {
				browser_registration = await Models.identified_browser.create({
					session_uid: visitor_session,
					device_id: device_registration.id,
					uid: identification.device.browser.uid,
					name: identification.device.browser.name,
					version: identification.device.browser.version
				});
			}
		}

		res.json({
			valid: true,
			data: Object.assign({
				device_registration: device_registration.id,
				public_vapid_key: process.env.publicVapidKey
			}, identification)
		});
	} else {
		res.json({
			valid: false,
			error: identification.error.details
		});
	}
});

module.exports = router;
