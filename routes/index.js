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
    function checkLogin(req, res, next) {
      if (!req.session.user){
        req.flash('error','未登录');
        res.redirect('/login');
      }
      next();
    }

    //检测是否未登录
    function checkNotLogin(req, res, next) {
      if (req.session.user) {
        req.flash('error','已登录');
        res.redirect('back');//返回之前页面
      }
      next();
    }


module.exports = function(app) {
  	//首页get
  	app.get('/',function(req,res){
      Post.get(null,function(err,posts){
        if(err){
          posts = [];
        }
        res.render('index',{
          title:'主页',
          user:req.session.user,
          posts:posts,
          success:req.flash('success').toString(),
          error:req.flash('error').toString()
        })
      })
  		// var data = {
  		// 	title:	'主页',
  		// 	user: req.session.user,
    //     success: req.flash('success').toString(),
    //     error:req.flash('error').toString()
  		// };
  		// res.render('index',data);
  	});

  	//注册页get
    app.get('/reg', checkNotLogin);
  	app.get('/reg', function (req, res) {
    	var data = {
        title:'注册',
        // user: req.session.user,
        // success: req.flash('success').toString(),
        // error:req.flash('error').toString()
      }
      res.render('reg', data);
  	});


    //注册页post
    app.post('/reg', checkNotLogin);
  	app.post('/reg', function (req, res) {
      var name = req.body.name;
      var password = req.body.password;
      var password_repeat = req.body.password_repeat;
      //检验两次密码是否一致
      if(password != password_repeat){
        // console.log(0);
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
          return res.redirect('/reg');
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
          //将用户信息存入会话
          req.session.user = newUser;
          req.flash('success','注册成功');
          res.redirect('/');
        })
      })
  	});
    // app.get('/')
    app.get('/login', checkNotLogin)
  	app.get('/login', function (req, res) {
      var data = {
        title:'登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error:req.flash('error').toString()
      }
  	  res.render('login', data);
	  });
    app.post('/login', checkNotLogin)
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

    //post/get
    app.get('/post', checkLogin)
 	  app.get('/post', function (req, res) {
    	var data = {
        title:'登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error:req.flash('error').toString()
      }
      res.render('post', data);
  	});

    //post/post
    app.post('/post', checkLogin)
  	app.post('/post', function (req, res) {
      var currentUser = req.session.user;
      var post = new Post(currentUser.name,req.body.title,req.body.post);
      post.save(function(err){
        if(err) {
          req.flash('error',err);
          return res.direct('/');
        }
        req.flash('success','发布成功');
        res.redirect('/');
      })
  	});

    //logout/get
    app.get('/logout', checkLogin)
  	app.get('/logout', function (req, res) {
      req.session.user = null;
      req.flash('success','登出成功');     
      res.redirect('/');
  	});


    
};
