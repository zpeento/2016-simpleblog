var express = require('express');
var path = require('path');
//支持session会话
var session = require('express-session');
//将获取的session信息储存到mongodb中
var MongoStore = require('connect-mongo')(session);
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
//生成express实例
var app = express();
//settings中存放的是数据库的配置信息
// var settings = require('./settings');


//使用connect-flash中间件
// view engine setup
//设置views为存放模板引擎的位置
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎为ejs
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//public文件夹中的favicon.ico为favicon
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
// app.use(logger('dev'));
//加载解析josn的中间件
// app.use(bodyParser.json());
// //加载解析urlencoded请求体的中间件
// app.use(bodyParser.urlencoded({ extended: false }));
// //加载解析cookie的中间件
// app.use(cookieParser());
//设置public为存放静态文件的文件夹
app.use(express.static(path.join(__dirname, 'public')));

//通过express-session 和 connect-mongo模块实现了将信息存储到mongodb中。
//secret用来对cookie加密 ，key的值为cookie的名字，通过设定maxage设置cookie的生存期。
//store参数为MongoStore的一个实例把信息存储到mongodb中
app.use(session({
  name:config.session.key,
  secret: config.session.secret,//通过设置secret来计算hash值并放在cookie中，使产生的cookie防篡改
  // key: settings.db,//cookie name
  cookie: {
    maxAge: config.session.maxAge//过期时间
  },//30 days
  resave:false,
  saveUninitialized:true,
  store: new MongoStore({
    //将session存储到mongodb
    // db: settings.db,
    url: config.mongodb
    // port: settings.port
  })
}));

//调用connect-flash中间件
// var flash = require('connect-flash');
app.use(flash());

app.use(require('express-formidable')({
  uploadDir: path.join(__dirname,'public/images'),//上传文件目录
  keepExtensions:true//保留后缀
}))
//路由控制器
//通过./routes/index.js调用route方法
// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
routes(app);

// app.use('/',routes);
// app.use('/posts',posts);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// //开发环境错误，将错误信息渲染error模板并显示到浏览器
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// // 生产环境错误
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


//导出app实例供其他模块调用
// module.exports = app;
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
