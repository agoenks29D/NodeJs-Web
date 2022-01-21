const express = require('express');
const router = express.Router();

router.route('/page/:id?/:option?')
.get((req, res, next) => {
	res.json({});
});

router.route('/post/:id?/:option?')
.get((req, res, next) => {
	res.json({});
});

router.route('/category/:id?/:option?')
.get((req, res, next) => {
	res.json({});
});

router.route('/tag/:id?/:option?')
.get((req, res, next) => {
	res.json({});
});

module.exports = router;
