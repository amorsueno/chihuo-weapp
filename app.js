//app.js
var Bmob = require('./utils/bmob.js')
var Constants = require('./utils/constants.js')
Bmob.initialize(Constants.BMOB_Application_ID, Constants.BMOB_REST_API_KEY);
App({
	onLaunch: function () {
        this.login();
	},
    login:function(){
        var that = this;
        this.getUserInfo(function(userInfo){
            console.log('获取用户信息>>>>>',userInfo);
        });
        // wx.login({
        //     success:function(res){
        //         console.log('登录success');
        //         //返回：{errMsg: "login:ok", code: "031zMo2h2woniG0kCd2h2UFj2h2zMo2i"}
        //         //若Bmob中未存，则存储到Bmob，若已存在不进行操作
        //         //存储到Storage
        //         console.log(res);
        //         wx.setStorageSync('loginSession', res);
        //     },
        //     fail:function(){
        //         console.log('登录fail');
        //     },
        //     complete:function(){
        //         console.log('登录complete');
        //     }
        // });
        //login end 
    },
    getUserInfo:function(cb){
        var that = this;
        if(this.globalData.userInfo){
            typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
            //调用登录接口
            wx.login({
                success: function (res) {
                    var code = res.code;
                    /* 获取用户信息 */
                    wx.getUserInfo({
                        success: function (res) {
                            //that.globalData.userInfo = res.userInfo;
                            that.globalData.userInfo = res;
                            wx.setStorageSync('loginSession', res);
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        }
                    });
                    /* 获取openid */
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + Constants.appId + '&secret=' + Constants.appSecret +'&js_code=' + code + '&grant_type=authorization_code',
                        data: {},
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            var openid = res.data.openid; //返回openid
                            wx.setStorageSync('openid', res.data.openid);
                            wx.setStorageSync('session_key', res.data.session_key);
                        }
                    });
                    /** */
                },
                fail:function(res){
                    console.log('error>>>>>',res);
                },
                complete:function(){
                    //完成登录
                }
            });
        }
    },
	globalData: {
		userInfo: null
	}
})