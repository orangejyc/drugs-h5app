/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	//owner.qrUrl="http://139.196.30.42/drugs/main.action";
	owner.qrUrl = "http://www.jhxmsy.com:8080/drugs/api/";
	//owner.qrUrl = "http://192.168.1.104:8080/drugs/api/";
	//owner.qrUrl="http://192.168.1.107:8080/main.action";
	//var ww=null;

	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';

		if(loginInfo.account.length < 5 || loginInfo.account.length > 12) {
			return callback('用户名不符合规则，字母数字下划线，长度在5~12');
		}
		if(loginInfo.password.length < 6 || loginInfo.password.length > 12) {
			return callback('密码不符合规则，以字母开头，长度在6~12之间，只能包含字符、数字和下划线');
		}
		var datas = {
			account: loginInfo.account,
			password: loginInfo.password
		};
		mui.ajax(owner.qrUrl + "login", {
			//data:JSON.stringify(regInfo),
			data: datas,
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 5000, //超时时间设置为5秒；
			crossDomain: true,
			beforeSend: function() {
				plus.nativeUI.showWaiting();
			},
			complete: function() {
				plus.nativeUI.closeWaiting();
			},
			success: function(result) {
				if(true == result.success) {
					return owner.createState(result.data, callback);
				} else {
					return callback(result.statusText);
				}

			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络错误");
			}
		});
	};

	owner.createState = function(userInfo, callback) {
		var state = owner.getState();
		state.account = userInfo.account;
		state.uid = userInfo.uid;
		state.expt = userInfo.expirationTimeString;
		//state.token = "token123456789";
		state.token = userInfo.userName + ":" + userInfo.uid;
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.phone = regInfo.phone || '';
		if(regInfo.account.length < 5) {
			return callback('用户名不符合规则，字母数字下划线，长度在5~12');
		}
		if(regInfo.password.length < 6) {
			return callback('密码不符合规则，以字母开头，长度在6~12之间，只能包含字符、数字和下划线');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		if(!regInfo.phone.length == 11) {
			return callback('手机号码不合法');
		}
		var datas = {
			account: regInfo.account,
			password: regInfo.password,
			email: regInfo.email,
			phone: regInfo.phone,
		};
		mui.ajax(owner.qrUrl + "reg", {
			//data:JSON.stringify(regInfo),
			data: datas,
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 5000, //超时时间设置为5秒；
			crossDomain: true,
			beforeSend: function() {
				plus.nativeUI.showWaiting();
			},
			complete: function() {
				plus.nativeUI.closeWaiting();
			},
			success: function(result) {

				//var result=JSON.parse(resultString);
				if(true == result.success) {
					return callback();
				} else {
					return callback(result.statusText);
				}

			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络错误");
			}
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(fpInfo, callback) {
		callback = callback || $.noop;
		if(fpInfo.account.length < 5 || fpInfo.account.length > 12) {
			return callback('用户名不符合规则，字母数字下划线，长度在5~12');
		}
		if(!checkEmail(fpInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var fpInfo1 = {
			account: fpInfo.account,
			email: fpInfo.email
		}
		mui.ajax(owner.qrUrl + "forgetPassword", {
			//data:JSON.stringify(regInfo),
			data: fpInfo1,
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 5000, //超时时间设置为5秒；
			crossDomain: true,
			beforeSend: function() {
				plus.nativeUI.showWaiting();
			},
			complete: function() {
				plus.nativeUI.closeWaiting();
			},
			success: function(result) {
				plus.nativeUI.closeWaiting();
				//var result=JSON.parse(resultString);
				if(true == result.success) {
					return callback(null, '重置邮件已发送到您的邮箱，请查收邮件。');
				} else {
					return callback(result.statusText);
				}

			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络错误");
			}
		});

	};

	/**
	 * 修改密码
	 **/
	owner.changePassword = function(changeInfo, callback) {
		callback = callback || $.noop;
		if(changeInfo.uname.length < 5 || changeInfo.uname.length > 12) {
			return callback('用户名不符合规则，字母数字下划线，长度在5~12');
		}
		if(changeInfo.npwd != changeInfo.qnpwd) {
			return callback('俩次输入新密码不一致');
		}
		var changeInfo1 = {
			account: changeInfo.uname,
			newPassword: changeInfo.npwd,
			password: changeInfo.pwd
		}
		mui.ajax(owner.qrUrl + "changePassword", {
			data: changeInfo1,
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 5000, //超时时间设置为5秒；
			crossDomain: true,
			beforeSend: function() {
				plus.nativeUI.showWaiting();
			},
			complete: function() {
				plus.nativeUI.closeWaiting();
			},
			success: function(result) {
				plus.nativeUI.closeWaiting();
				if(true == result.success) {
					return callback(null, '密码修改成功，请重新登录。');
				} else {
					return callback(result.statusText);
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast("网络错误");
			}
		});
	};

	// 检测是否安装支付服务
	owner.checkServices = function(pc) {
		if(!pc.serviceReady) {
			var txt = null;
			switch(pc.id) {
				case "weixin":
					txt = "检测到系统未安装“微信”，无法完成支付操作，是否立即安装？";
					break;
				default:
					txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
					break;
			}
			plus.nativeUI.confirm(txt, function(e) {
				if(e.index == 0) {
					pc.installService();
				}
			}, pc.description);
		}
	}

	/**
	 * 微信支付
	 **/

	owner.paywx = function(payInfo, callback) {
		callback = callback || $.noop;
		payInfo.uid = payInfo.account;
		if(payInfo.account.length < 5 || payInfo.account.length > 12) {
			return callback('用户名不符合规则，字母数字下划线，长度在5~12');
		}
		if("M" != payInfo.type && "Y" != payInfo.type) {
			return callback('购买类型不合法');
		}
		if(payInfo.num && !payInfo.num > 0) {
			return callback('购买数量不合法');
		}

		var alichannel;
		// 获取支付通道

		plus.payment.getChannels(function(channels) {
			for(var i in channels) {
				var channel = channels[i];
				if(channel.id == 'weixin') {
					//plus.nativeUI.alert(JSON.stringify(channel));
					alichannel = channel;
					owner.checkServices(alichannel);
				} else {
					continue;
				}
			}
		}, function(e) {
			return callback("获取支付通道失败：" + e.message);
		});

		mui.ajax(owner.qrUrl + "wxOrder", {
			//data:JSON.stringify(regInfo),
			data: payInfo,
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 5000, //超时时间设置为5秒；
			crossDomain: true,
			beforeSend: function() {
				plus.nativeUI.showWaiting();
			},
			complete: function() {
				plus.nativeUI.closeWaiting();
			},
			success: function(result) {
				plus.nativeUI.closeWaiting();
				//var result=JSON.parse(resultString);
				if(true == result.success) {
					plus.nativeUI.alert(result.data);
					/*
					plus.payment.request(alichannel,result.data,function(payResult){
						plus.nativeUI.alert("支付成功。",function(){
							back();
						},"支付");*/
				} else {
					return callback(result.statusText);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络错误");
			}
		});
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));