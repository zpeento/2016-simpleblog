var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: '一个简单的博客' });
// });

// module.exports = router;

module.exports = function(app) {
	//首页
	app.get('/',function(req,res){
		var data = {
			title:	'Cleaning Supplies',
			supplies:	['mop', 'broom', 'duster']
		};
		res.render('index',data);
	});
	//登录页
  	app.get('/reg', function (req, res) {
    	res.render('reg', { title: '注册' });
  	});
  	app.post('/reg', function (req, res) {
  	});
  	app.get('/login', function (req, res) {
  	  res.render('login', { title: '登录' });
	});
  	app.post('/login', function (req, res) {
  	});
 	app.get('/post', function (req, res) {
    	res.render('post', { title: '发表' });
  	});
  	app.post('/post', function (req, res) {
  	});
  	app.get('/logout', function (req, res) {
  	});
};
