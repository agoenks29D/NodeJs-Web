const express = require('express');
const router = express.Router();

router

/**
 * home
 */
.get('/', function(req, res) {
	res.render('@site/home.twig', {
		page_attributes: {
			name: lang('page-title.home')
		},
		name: 'Developer'
	});
})

.get('/page/:slug', (req, res) => {
	res.render('@site/page.twig', {
		page_attributes: {
			name: lang('page-title.page')
		}
	});
})

.get('/post/:slug', (req, res) => {
	res.render('@site/post.twig', {
		page_attributes: {
			name: lang('page-title.post')
		}
	});
});

module.exports = router;
