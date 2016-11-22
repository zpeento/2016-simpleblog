var crypto = require('crypto');
var User = require('../modules/user')
var Post = require('../modules/post')
var express = require('express');
var router = express.Router();



/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: '一个简单的博客' });
// });

// module.exports = router;
    //检测是否登录
    // function checkLogin(req, res, next) {
    //   if (!req.session.user){
    //     req.flash('error','未登录');
    //     res.redirect('/login');
    //   }
    //   next();
    // }

    // //检测是否未登录
    // function checkNotLogin(req, res, next) {
    //   if (req.session.user) {
    //     req.flash('error','已登录');
    //     res.redirect('back');//返回之前页面
    //   }
    //   next();
    // }


module.exports = function(app) {
  	//首页get
  	app.get('/',function(req,res) {
      res.redirect('/posts');
    })

    app.use('/signup',require('./signup'));
    app.use('/signin',require('./signin'));
    app.use('/signout',require('./signout'));
    app.use('/posts',require('./posts'))
};
