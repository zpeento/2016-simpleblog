# 2016-simpleblog
基于nodejs/express/ejs/mongodb开发的一个简单博客。

项目中调用的node核心模块：
crypto:用于生成散列值来加密密码。

项目使用到的中间件：
1.connect-mongo:用于将会话信息存放在mongodb中。

2.connect-flash:在session中建立一个用于存放信息的特定空间，下一次显示完后清除。

3.connect-session:在express.4.x中被剥离，对session进行扩展。

4.express-session:通过express-session中间件实现会话支持
app.use(session(options))
session中间件会在req上添加session对象。req.session的初始值为{}

项目中用于开发的模块：
supervisor:每次更新代码后自动重启应用(supervisor ./bin/www)。

其他：
markdown:博客文章使用markdown语法
