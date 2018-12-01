const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);

module.exports = router;

// Initial Code
/*router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});*/

// Changed to This...
/*const homepageController = function(req, res) {
  res.render('index', {title: 'Moving Shit Part 1'})
};
router.get('/', homepageController);*/