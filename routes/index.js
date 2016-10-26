var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: '一个简单的博客' });
// });

// module.exports = router;

module.exports = function(app) {
	app.get('/',function(req,res){
		res.render('index',{title:'一个简单的博客'});
	});
};
