// info.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        try {
            var value = wx.getStorageSync('userInfo')
            if (value) {
                console.log(value);
                that.setData({
                    user: value
                })
            } else {
                wx.getUserInfo({
                    success: function (res) {
                        console.log(res);
                        value = res.userInfo;
                        that.setData({
                            user: value
                        })
                        // var userInfo = res.userInfo
                        // var nickName = userInfo.nickName
                        // var avatarUrl = userInfo.avatarUrl
                        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        // var province = userInfo.province
                        // var city = userInfo.city
                        // var country = userInfo.country
                    }
                })
            }
        } catch (e) {
            console.log("error get userInfo");
        }
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
       
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
       
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    info:function(){
        
    }
})