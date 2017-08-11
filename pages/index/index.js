//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js')
Bmob.initialize("97860e811e83b2704688a75c6a3bc26c", "a10000d5d06bcb3683ef40740d5bd2f0");

var app = getApp();
var that;
var sliderWidth = 96;
var firstListLoad = true;
var firstListDoneLoad = true;
Page({
    data: {
        nowopenid: '',
        loading: false,
        windowHeight: 0,
        windowWidth: 0,
        limit: 10,
        nonePicUrl: 'http://ordltxx69.bkt.clouddn.com/nopic.png',
        tabs: ['未吃', '已吃'],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        list: [],
        listDone: [],
        page_size:5,
        page_index:0
    },
    onLoad: function () {
        that = this;
        that.setData({
            nowopenid: wx.getStorageSync('openid')
        })
    },
    onShow: function () {
        getFirstPage(this);
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth,
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                })
            },
        })
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        if (this.data.activeIndex == 1 && firstListDoneLoad==true){
            getListDone(this);
        }
    },
    pullDown: function () {
        wx.showToast({
            title: 'loading...',
            icon: 'loading'
        });
        getFirstPage(this);
    },
    pullUp: function () {
        wx.showToast({
            title: 'loading...',
            icon: 'loading'
        });
        getNextPage(this);
    },
    pullUpLoad: function (e) {
        var limit = that.data.limit + 2
        this.setData({
            limit: limit
        })
        this.onShow()
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
        getList(this);
    },
    openAdd: function () {
        wx.navigateTo({ url: '/pages/add/add' });
    },
    inputTyping: function (e) {
        //搜索数据
        getFirstPage(this, e.detail.value);
        this.setData({
            inputVal: e.detail.value
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        getFirstPage(this);
    },
    doAddPost: function (e) {
        var title = event.detail.value.title;
        var author = event.detail.value.content;

    }

})

/**
 * 获取未吃列表
 */
function getFirstPage(t, k) {
    var that = t;
    var Record = Bmob.Object.extend("Record");
    var query = new Bmob.Query(Record);
    query.equalTo("openId", that.data.nowopenid);
    query.equalTo("done", false);
    query.ascending("title");
    query.limit(that.data.page_size);
    var data;
    query.find({
        success: function (res) {
            data = res;
            that.setData({
                list: res,
                page_index:1
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
    return data;
}
function getNextPage(t, k){
    var that = t;
    var Record = Bmob.Object.extend("Record");
    var query = new Bmob.Query(Record);
    query.equalTo("openId", that.data.nowopenid);
    query.equalTo("done", false);
    query.ascending("title");
    query.limit(that.data.page_size);
    query.skip(that.data.page_size*(that.data.page_index+1));
    var data;
    query.find({
        success: function (res) {
            console.log(res);
            data = that.data.list.concat(res);
            that.setData({
                list: that.data.list.concat(res),
                page_index:that.data.page_index++
            })
            console.log(that.data.list.length);
            console.log('----------------');
        },
        error: function (err) {
            console.log(err);
        }
    });
    return data;
}
/**
 * 获取已吃列表
 */
function getListDone(t, k) {
    that = t;
    var Record = Bmob.Object.extend("Record");
    var query = new Bmob.Query(Record);
    query.equalTo("openId", that.data.nowopenid);
    query.equalTo("done", true);
    query.limit(10);
    var data;
    query.find({
        success: function (res) {
            data = res;
            that.setData({
                listDone: res
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
    return data;
}

