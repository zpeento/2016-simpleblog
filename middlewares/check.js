module.exports = {
	//当用户信息，即req.session.user不存在，即认为用户没有登录，则返回登录页面。同时显示未登录的信息。
	//用于需要用户登录才能操作的窗口。
	checkLogin: function checkLogin(req,res,next) {
		if(!req.session.user) {
			req.flash('error','未登录');
			return res.redirect('/sigin');
		}
		next();
	},

	//当用户信息存在的时候。认为用户已经登录，则跳转到之前页面。并显示已登录的信息。
	//用于如登录、注册以及他们的接口
	checkNotLogin: function checkNotLogin(req,res,next){
		if (req.session.user) {
			req.flash('error','已登录');
			return res.redirect('back');//返回前一个页面
		}
		next();
	}
};