const express = require('express');
const router = express.Router();

router

/**
 * home
 */
.get('/', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/home.twig', {
		title: 'title',
		user: req.user
	});
})

/**
 * sign up
 */
.get('/sign-up', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/sign-up.twig', {
		title: 'title'+' - Sign Up'
	});
})

/**
 * sign in
 */
.get('/sign-in', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/sign-in.twig', {
		page_attributes: {
			name: lang('sign-in')
		},
		name: 'Developer',
		redirected: req.flash('redirected')
	});
})

/**
 * recover account
 */
.get('/recover-account', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/recover-account.twig', {
		title: 'title'+' - Reset Password'
	});
})

/**
 * profile
 */
.get('/profile/:uid?', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/profile.twig', {
		title: 'title'+' - Profile'
	});
})

.get('/sign-out', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	req.session.destroy();
	res.redirect('/user/sign-in');
});

module.exports = router;
