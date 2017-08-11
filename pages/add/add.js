var util = require('../../utils/util.js');
var formatLocation = util.formatLocation;
var formatDate = util.formatDate;
var Bmob = require('../../utils/bmob.js')
Bmob.initialize("97860e811e83b2704688a75c6a3bc26c", "a10000d5d06bcb3683ef40740d5bd2f0");

// add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:'',//主题
      description:'',//备注
      inputTextSize:0,
      uploadImages:[],
      allImages:[],
      openGId: '',//群id
      priority: '',//优先级
      keywords: '',//关键字
      done: true,//是否已吃
      user:{},//当前用户信息
      location:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showShareMenu({
        withShareTicket:true//要求小程序返回分享目标信息
    });
    // 获取用户信息
    try {
        var value = wx.getStorageSync('userInfo')
        if (value) {
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
                    });
                }
            })
        }
    } catch (e) {
        console.log("error get userInfo");
    }
  },
  onShareAppMessage(){
      return {
        title:'吃货!快来添加新备忘录!',
        path:'/pages/add/add',
        success(res){
            console.log(res.shareTickets);
            wx.getShareInfo({
                shareTicket: res.shareTickets,
                complete(res){
                    //内部调用云端代码
                    var curUser = Bmob.User.current();
                    var data = {
                        "objectId": curUser.id, "encryptedData": res.encryptedData, "iv": res.iv };
                    Bmob.Cloud.run('getOpenGId', data).then(function (obj) {
                        // var res = JSON.parse(obj)
                        console.log(obj)
                    }, function (err) {
                        console.log(err)
                    });
                }
            });
        }
      };
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
        openId: wx.getStorageSync('openid'),
        author: wx.getStorageSync('userInfo')
    })
  },
  /**
   * 选择位置
   */
  chooseLocation: function () {
      var that = this
      wx.chooseLocation({
          success: function (res) {
              var location = {
                  flag:true,
                  address:res.address,
                  addressName: res.name,
                  longitude: res.longitude,
                  latitude: res.latitude,
                  a: formatLocation(res.longitude, res.latitude)
              };
              that.setData({
                  location: location
              })
          }
      })
  },
  titleinput:function(e) {
      this.setData({
          title: e.detail.value  
      })
  },
  textareaInput:function(e){
    this.setData({
        description:e.detail.value,
        inputTextSize:e.detail.value.length
    })
  },
  chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
          count:9,//默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有'original', 'compressed'
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
             wx.showNavigationBarLoading();
             that.setData({
                 loading:false
             });
             var urlArr = new Array();
             var tempFilePaths = res.tempFilePaths;
             console.log(tempFilePaths);
             var len = tempFilePaths.length;
             if(len > 0){
                var nowDateStr = util.formatDate(new Date(),"yyyyMMddhhmmssSSS");
                var j = 0;
                for(var i = 0; i < len; i++){
                    var tempFilePath = [tempFilePaths[i]];
                    var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
                    if (extension) {
                        extension = extension[1].toLowerCase();
                    }
                    var name = nowDateStr +"_"+(i+1)+"."+extension;
                    var file = new Bmob.File(name,tempFilePath);
                    file.save().then(function (res) {
                        wx.hideNavigationBarLoading();
                        var url = res.url();
                        console.log("第" + (i+1) + "张Url" + url);

                        urlArr.push({ "url": url });
                        j++;
                        console.log(j, imgLength);
                        // if (imgLength == j) {
                        //   console.log(imgLength, urlArr);
                        //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                        showPic(urlArr, that)
                        // }

                    }, function (error) {
                        console.log(error)
                    });
                }
             }


          }
      })
  },
  previewImage: function (e) {
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.allImages // 需要预览的图片http链接列表
      })
  },
  delPic:function(e){
      var that = this;
      var index = e.currentTarget.dataset.index;
      var allImages = that.data.allImages;
      allImages.splice(index, 1)
      that.setData({
          allImages: allImages
      });
    wx.showToast({
        title: '删除成功！',
        icon: 'success'
    });
  },
  add:function(e){
      var that = this;
      console.log(this.data);
      if(this.data.title === '' ){
          wx.showModal({
              title: '提示',
              content: '请输入主题',
              showCancel:false,
              success: function (res) {}
          })
      }

      var Record = Bmob.Object.extend("Record");
      var record = new Record();
      record.set('title',this.data.title);
      record.set('description', this.data.description);
      record.set('nickName', this.data.user.nickName);
      record.set('avatarUrl', this.data.user.avatarUrl);
      record.set('openId', this.data.openId);
      record.set('openGId', '');
      record.set('done', false);//默认未吃
      record.set('address', this.data.location.address);
      record.set('addressName', this.data.location.addressName);
      record.set('location', this.data.location.latitude + "," + this.data.location.longitude);
      record.set('priority', '0');//TODO
      record.save(null,{
        success:function(res){
            console.log("新增成功！objectId:",res.id);
        },
        error:function(res,err){
            //添加失败
            console.log(err);
        }
      });
  },


})


//上传完成后显示图片
function showPic(urlArr, t) {
    t.setData({
        loading: true,
        urlArr: urlArr
    })
}