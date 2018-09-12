const app = getApp()
const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 41;

Page({
  data: {
    token: "",
    phoneType: "",
    nickname:"",
    phone:"",
    email:"",
    signature:"",
    isShowToast:false,
    phoneText:"",
    realName:""
  },
  onLoad: function (options) {
    req.analyticsLog({
      event: 'view',
      pid
    });
  },
  showToast: function () {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭  
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, _this.data.count);
  }, 
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data,
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (res) {
            that.setData({
              phoneType: res.data,
            })
            wx.request({
              url: app.api.getMyInfo,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                if (res.data.status == 2000) {
                  that.setData({
                    nickname: res.data.data.nickname,
                    phone: res.data.data.phone,
                    email:res.data.data.email,
                    signature: res.data.data.signature,
                  })
                }
                if(res.data.status == 2013){
                  var newTitle = res.data.msg;
                  that.setData({
                    count: 1500,
                    toastText: newTitle
                  });
                  that.showToast(); 
                  wx.clearStorageSync();
                } 
              }
            })
          },
        })
      },
    })
  },
  username:function(e){
    this.setData({
      username:e.detail.value
    })
  },
  signature: function (e) {
    this.setData({
      signature: e.detail.value
    })
  },
  // phone:function(e){
  //   this.setData({
  //     phoneText: e.detail.value
  //   })
  // },
  keep:function(){
    var that = this;
    var token = that.data.token;
    var phoneType = that.data.phoneType;
    var nickName = that.data.username;
    var signature = that.data.signature;
    // var phone = that.data.phoneText;
    if (nickName != null && nickName != ""){
      wx.request({
        url: app.api.updateMyModuleMember,
        data: {
          token: token,
          phonetype: phoneType,
          signature: signature,
          nickname: nickName,
          channel: 6
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            var title = res.data.msg;
            that.setData({
              count: 1500,
              toastText: '保存成功！'
            });
            that.showToast();
            setTimeout(function () {
              wx.navigateBack();
            }, 500)
          }else{
            that.setData({
              count: 1500,
              toastText:res.data.msg
            });
            that.showToast();
          }
        }
      })
    }else{
      that.setData({
        count: 1500,
        toastText: '昵称不能为空！'
      });
      that.showToast();
    }
  }
})