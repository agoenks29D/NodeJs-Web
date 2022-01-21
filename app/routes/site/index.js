const express = require('express');
const router = express.Router();

router

/**
 * home
 */
.get('/', function(req, res) {
	res.render('@site/home.twig', {
		page_attributes: {
			name: lang('home')
		},
		name: 'Developer'
	});
})

.get('/page/:slug', (req, res) => {
	res.render('@site/page.twig', {
		page_attributes: {
			name: lang('page')
		}
	});
})

.get('/post/:slug', (req, res) => {
	res.render('@site/post.twig', {
		page_attributes: {
			name: lang('page')
		}
	});
});

module.exports = router;
