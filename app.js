var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//生成express实例
var app = express();
//settings中存放的是数据库的配置信息
var settings = require('./settings');
//支持session会话
var session = require('express-session');
//将获取的session信息储存到mongodb中
var MongoStore = require('connect-mongo')(session);
//使用connect-flash中间件

//调用node.js核心模块crypto给密码加密
// var crypto = require('crypto');
// view engine setup
//设置views为存放模板引擎的位置
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎为ejs
app.set('view engine', 'ejs');
//调用connect-flash中间件

// uncomment after placing your favicon in /public
//public文件夹中的favicon.ico为favicon
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
app.use(logger('dev'));
//加载解析josn的中间件
app.use(bodyParser.json());
//加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public为存放静态文件的文件夹
app.use(express.static(path.join(__dirname, 'public')));
//路由控制器
//通过./routes/index.js调用route方法
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  resave:false,
  saveUninitialized:true,
  store: new MongoStore({
    // db: settings.db,
    url: 'mongodb://localhost/blog',
    // port: settings.port
  })
}));
var flash = require('connect-flash');
app.use(flash());
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//开发环境错误，将错误信息渲染error模板并显示到浏览器
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// 生产环境错误
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//通过express-session 和 connect-mongo模块实现了将信息存储到mongodb中。
//secret用来对cookie加密 ，key的值为cookie的名字，通过设定maxage设置cookie的生存期。
//store参数为MongoStore的一个实例把信息存储到mongodb中

//导出app实例供其他模块调用
module.exports = app;
