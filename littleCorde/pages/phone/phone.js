var app = getApp();
Page({
  data: {
    token: "",
    phoneType: "",
    phone: "",
    code: "",
    isShowToast: false,
    phoneText: "",
    codeText: "",
    getmsg: "获取验证码",
    getCodeDisabled: false,
  },
  onLoad: function(options) {
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    this.setData({
      token:token,
      phoneType: phonetype
    })
  },

  onShow: function() {

  },
  phone: function(e) {
    this.setData({
      phoneText: e.detail.value
    })
  },
  code: function(e) {
    this.setData({
      codeText: e.detail.value
    })
  },
  getCode: function() {
    var that = this;
    var phone = this.data.phoneText;
    var a = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (phone != null && phone != "") {
      if (a.test(phone)) {
        wx.request({
          url: app.api.getCode,
          data: {
            wxsecret: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8mdwgDezyq/AwGExge5QmVNfpe9z0YPgijMFTJ/QGC3aNEq23mZQ2Q6VVOVU8wSIOCQMOr6OPj0QiH91wVHx5sfa',
            phone: phone
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.status == 2000) {
              wx.showToast({
                title: '发送成功',
                icon: "success",
                duration: 1000,
                mask: true
              })
              that.setData({
                getCodeDisabled: true
              })
              that.sendmessg()
            } else {
              that.setData({
                count: 1500,
                toastText: res.data.msg
              });
              that.showToast();
            }
          }
        })
      } else {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: "none",
        duration: 1000,
        mask: true
      })
    }
  },
  keep: function() {
    console.log(333)
    var that = this;
    var token = this.data.token;
    var phoneType = this.data.phoneType;
    var phone = this.data.phoneText;
    var code = this.data.codeText;
    if (phone != null && phone != "") {
      if (code != null && code != "") {
        wx.request({
          url: app.api.insertBindPhoneNum,
          data: {
            token: token,
            phonetype: phoneType,
            channel: 6,
            code: code,
            phone: phone
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "GET",
          success: function(res) {
            if (res.data.data) {
              var title = res.data.msg;
              that.setData({
                count: 1500,
                toastText: '绑定成功！'
              });
              that.showToast();
              setTimeout(function() {
                wx.switchTab({
                  url: '../my/index',
                })
              }, 500)
            } else {
              that.setData({
                count: 1500,
                toastText: res.data.msg
              });
              that.showToast();
            }
          }
        })
      } else {
        that.setData({
          count: 1500,
          toastText: '验证码不能为空！'
        });
        that.showToast();
      }
    } else {
      that.setData({
        count: 1500,
        toastText: '手机号不能为空！'
      });
      that.showToast();
    }
  },
  showToast: function() {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭  
    setTimeout(function() {
      _this.setData({
        isShowToast: false
      });
    }, _this.data.count);
  },
  sendmessg: function() {
    var time = 60;
    var that = this;
    var inter = setInterval(function() {
      if (time > 0) {
        that.setData({
          getmsg: time + "秒后重新发送",
        })
        time--;
      }
      if (time <= 0) {
        clearInterval(inter)
        that.setData({
          getmsg: "获取验证码",
          getCodeDisabled: false
        })
        clearInterval(inter);
      }
    }, 1000)
  },
})