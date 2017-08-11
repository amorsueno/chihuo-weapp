// image.js
var Bmob = require('../../utils/bmob.js')
Bmob.initialize("97860e811e83b2704688a75c6a3bc26c", "a10000d5d06bcb3683ef40740d5bd2f0");
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[]
  },
  chooseImage:function(){
    var that = this;
    console.log("开始选择图片");
    wx.chooseImage({
        // sourceType: '拍照或相册',
        sizeType: 'compressed',
        count: 9,
        success: function(res) {  
            if (that.data.imageList.concat(res.tempFilePaths).length>9){//若大于9张，提示并删除9之后的
                var list = that.data.imageList.concat(res.tempFilePaths);
                var newList = [];
                for(var i=0;i<9;i++){
                    newList[i] = list[i];
                }
                that.setData({
                    imageList: newList
                });
                console.log("大于9张");
                return;
            }
            wx.showNavigationBarLoading();
            that.setData({
                imageList: that.data.imageList.concat(res.tempFilePaths)
            });
            var urlArr = new Array();
            var tempFilePaths = res.tempFilePaths;
            var imgLength = tempFilePaths.length;
            if(imgLength>0){
                var newDate = new Date();
                var newDateStr = util.formatDate(newDate,'yyyyMMddhhmmssS');
                var j = 0;
                for(var i = 0;i<imgLength;i++){
                    var path = [tempFilePaths[i]];
                    var extension = /\.([^.]*)$/.exec(path[0]);
                    if (extension) {
                        extension = extension[1].toLowerCase();
                    }

                    var name = newDateStr +"00"+ util.getRandomNum(5)+ "." + extension;//上传的图片的别名      
                    var file = new Bmob.File(name,path);
                    file.save().then(
                        function(res){
                            console.log("上传成功", res.url());
                            wx.hideNavigationBarLoading();
                        },function(err){
                            console.log("上传出错",err);
                        }
                    );
                }
            }

        }
    })
  },
  previewImage:function(e){
      var current = e.target.dataset.src
      wx.previewImage({
          current: current,
          urls: this.data.imageList
      })
  },
  add:function(){

  }
})