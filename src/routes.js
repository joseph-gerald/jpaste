const express = require('express');
const router = express.Router();
const errorController = require('./controllers/errorController');
const apiController = require('./controllers/apiController');

// webcrawlers
router.get('/robots.txt', apiController.getRobots);
router.get('/robots.min.txt', apiController.getRobotsMinified);

// api logic
router.post('/api/v1/ping', apiController.ping);

// paste logic
router.put('/api/v1/paste', apiController.createPaste);
router.post('/:code', apiController.viewProtectedPaste);
router.get('/:code', apiController.viewPaste);

router.use((req, res, next) => {
    if (req.method === 'GET') {
        errorController.get404Page(req, res);
    } else {
        res.status(404).send("Could not find anything for \"" + req.path + "\"");
    }
});


module.exports = router;