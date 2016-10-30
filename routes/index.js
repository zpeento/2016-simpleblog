var crypto = require('crypto');
var User = require('../modules/user')
var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: '一个简单的博客' });
// });

// module.exports = router;

module.exports = function(app) {
  	//首页get
  	app.get('/',function(req,res){
  		var data = {
  			title:	'主页',
  			user: req.session.user,
        success: req.flash('success').toString(),
        error:req.flash('error').toString()

  		};
  		res.render('index',data);
  	});

  	//注册页get
  	app.get('/reg', function (req, res) {
    	var data = {
        title:'注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error:req.flash('error').toString()
      }
      res.render('reg', data);
  	});


    //注册页post
  	app.post('/reg', function (req, res) {
      var name = req.body.name;
      var password = req.body.password;
      var password_repeat = req.body.password_repeat;
      //检验两次密码是否一致
      if(password != password_repeat){
        console.log(0);
        // alert(0);
        req.flash('error','两次输入的密码不一样！');
        return res.redirect('/reg');//返回注册页
      }
      //生成密码md5
      var md5 = crypto.createHash('md5');
      password = md5.update(req.body.password).digest('hex');
      var newUser = new User({
        name: name,
        password:password,
        email:req.body.email
      })

      //检测用户名是否存在
      User.get(newUser.name,function (err, user){
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        if (user){
          req.flash('error','用户已存在!');
          return res.redirect('/reg');
        }
        newUser.save(function (err,user){
          if (err) {
            req.flash('error',err);
            return res.redirect('/reg');
          }
          newUser.save(function (err,user) {
            if (err) {
              req.flash('error',err);
              return res.redirect('/reg');
            }
            //将用户信息存入会话
            req.session.user = newUser;
            req.flash('success','注册成功');
            res.redirect('/');
          })
        })
      })
  	});

  	app.get('/login', function (req, res) {
      var data = {
        title:'登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error:req.flash('error').toString()
      }
  	  res.render('login', data);
	  });
  	app.post('/login', function (req, res) {
      //生成密码的md5值
      var md5 =crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('hex');

      //检测用户名是否已存在
      User.get(req.body.name,function(err,user){
        if(!user) {
          req.flash('error','用户名不存在');
          return res.redirect('/login');
        }
        //检测密码是否一致
        if(user.password != password) {
          req.flash('error','密码错误');
          return res.redirect('/login');
        }
        //用户名密码匹配，将用户信息存入session
        req.session.user = user;
        req.flash('success','登录成功');
        res.redirect('/');
      })
  	});
 	  app.get('/post', function (req, res) {
    	res.render('post', { title: '发表' });
  	});
  	app.post('/post', function (req, res) {
  	});
  	app.get('/logout', function (req, res) {
      req.session.user = null;
      req.flash('success','登出成功');     
      res.redirect('/');
  	});
};
