const express = require('express');
const router = express.Router();

router

/**
 * home
 */
.get('/', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/home.twig');
})

/**
 * sign up
 */
.get('/sign-up', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/sign-up.twig', {
		redirected: req.flash('redirected')
	});
})

/**
 * sign in
 */
.get('/sign-in', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/sign-in.twig', {
		redirected: req.flash('redirected')
	});
})

/**
 * recover account
 */
.get('/recover-account', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/recover-account.twig');
})

/**
 * reset account password
 */
.get('/reset-password', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/authentication/reset-password.twig');
})

/**
 * profile
 */
.get('/profile/:uid?/:option?', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	res.render('@user/profile.twig');
})

.get('/sign-out', Middlewares.user.session_redirect, Middlewares.user.profile, (req, res) => {
	req.session.destroy();
	res.redirect('/user/sign-in');
});

module.exports = router;
