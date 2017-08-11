var Bmob = require('../../utils/bmob.js')
var WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js')
var appId = 'wxc0e094b8b9d0ed34';
Bmob.initialize("97860e811e83b2704688a75c6a3bc26c", "a10000d5d06bcb3683ef40740d5bd2f0");
// detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    nopic_url:"http://ordltxx69.bkt.clouddn.com/nopic.png",
    record:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showShareMenu({
          withShareTicket:true
      });
        wx.showLoading({
            title: '加载中...',
        });
        this.setData({
            id:options.id
        });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var record = Bmob.Object.extend("Record");
    var query = new Bmob.Query(record);

    query.get(this.data.id,{
        success:function(res){
            console.log(res.attributes);
            wx.hideLoading();
            that.setData({
                record:res.attributes
            });
            wx.setNavigationBarTitle({
                title: res.get("title")
            });
        },
        error:function(err){
            console.log("请求数据失败！");
            wx.showToast({
                title: '请求失败...',
                icon: 'loading',
                duration: 2000
            })
        }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
        title:that.data.record.title,
        path:'/pages/detail/detail?id='+that.id,
        success(res){
            console.log(res);
            var pc = new WXBizDataCrypt(appId,'');
            wx.getShareInfo({
                shareTicket: res.shareTickets[0],
                
                // var pc = new WXBizDataCrypt()
                success(res){
                    console.log(res);
                    //后台解密，获取openGID
                }
            })
        }
    };
  }
})