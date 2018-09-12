var app = getApp();
const envVersion = "release";
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 3;
//const envVersion = "develop";
Page({
  data: {
    token: "",
    phoneType: "",
    userInfo: {},
    avatarUrl: "",
    pointNumber: "",
    collageNumber: "",
    disCountCardNumber: "",
    giftCardNumber: "",
    handSlap: true,
    phoneCode: true,
    code: "",
    isShowToast: false,
    phone: "",
    _phone: "",
    isBind: true,
    bannerInfo:[]
  },
  onLoad: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl
              });
            }
          })
        }
      }
    })
    that.setData({
      isBind: app.globalData.isBind
    })
  },
  onShow: function(options) {
    var that = this;
    if (that.data.userInfo == undefined) {
      that.setData({
        userInfo: {
          avatarUrl: "../../image/touxiangLoad.png",
          nickName: "未登录"
        }
      })
    }
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function(result) {
            that.setData({
              phoneType: result.data
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
              success: function(res) {
                if (res.data.status == 2000) {
                  that.setData({
                    userInfo: res.data.data
                  })
                }
                if (res.data.status == 2013) {
                  var newTitle = res.data.msg;
                  that.setData({
                    count: 1500,
                    toastText: newTitle
                  });
                  that.showToast();
                  wx.clearStorageSync();
                }
              }
            });
            wx.request({
              url: app.api.getIsBindPhoneNum,
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
                    isphone: res.data.data
                  })
                }
                if (res.data.status == 2013) {
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
            wx.request({
              url: app.api.getFavoriteNumber,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              dataType: "json",
              success: function(res) {
                if (res.data.status == 2000) {
                  that.setData({
                    pointNumber: res.data.data.pointNumber,
                    favoriteNumber: res.data.data.favoriteNumber,
                    disCountCardNumber: res.data.data.disCountCardNumber,
                    giftCardNumber: res.data.data.giftCardNumber,
                    isBind:false,
                    bannerInfo: res.data.data.bannerInfo,
                  })
                }
              }
            })
            wx.request({
              url: app.api.getMemberIsIntroducer,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              success: function(res) {
                if (res.data.status == 2000) {
                  if (res.data.data.outcome) {
                    that.setData({
                      handSlap: true,
                      handSlapStatus: res.data.data.introducer.status
                    })
                  } else {
                    that.setData({
                      handSlap: false
                    })
                  }
                }
              }
            })
          },
        })
      },
    })

    req.analyticsLog({
      event: 'view',
      pid
    })
  },
  weService() {
    req.analyticsLog({
      event: 'cocs',
      pid
    });
  },
  bindViewTap: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {} else {}
  },
  allOrder: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../order/index?currentTab=0',
      })
    } else {}
  },
  disposeOrder: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../order/index?currentTab=2',
      })
    } else {}
  },
  payOrder: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../order/index?currentTab=1',
      })
    } else {}
  },
  successOrder: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../order/index?currentTab=3',
      })
    } else {}
  },
  personalInfo: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../personalInfo/personalInfo',
      })
    } else {}
  },
  coupon: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../discount/discount?currentTab=0',
      })
    } else {}
  },
  discount: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../discount/discount?currentTab=1',
      })
    } else {}
  },
  address: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../address/address',
      })
    } else {}
  },
  point: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../point/point',
      })
    } else {}
  },
  collect: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../collect/collect',
      })
    } else {}
  },
  group: function() {
    if (this.data.token != "" && this.data.token != null && this.data.phoneType != "" && this.data.phoneType != null) {
      wx.navigateTo({
        url: '../shareTheBill/shareTheBill?currentTab=0',
      })
    } else {}
  },
  onPullDownRefresh: function() {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  getPhoneNumber: function(e) {
    var data = e.detail.encryptedData;
    var iv = e.detail.iv;
    var that = this;
    wx.login({
      success: function(res) {
        var code = res.code;
        if (e.detail.errMsg == "getPhoneNumber:fail 用户未绑定手机，请先在微信客户端进行绑定后重试") {} else {
          if (e.detail.errMsg == "getPhoneNumber:fail 用户绑定的手机需要进行验证，请在客户端完成短信验证步骤") {} else {
            if (e.detail.errMsg == "getPhoneNumber:ok") {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '同意授权',
                success: function(res) {
                  wx.request({
                    url: app.api.getWXSystemPhoneCode,
                    data: {
                      code: code,
                      iv: iv,
                      data: data
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function(data) {
                      if (data.data.status == 2000) {
                        that.setData({
                          phoneCode: false,
                          phone: data.data.data
                        })
                        var phone = data.data.data;
                        phone = phone.substr(0, 3) + "****" + phone.substr(7);
                        that.setData({
                          _phone: phone
                        })
                      }
                    }
                  })
                }
              })
            } else {
              that.setData({
                count: 1500,
                toastText: "未授权"
              });
              that.showToast();
            }
          }
        }
      }
    })
  },
  phoneCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  delPhoneCode: function() {
    var that = this;
    that.setData({
      phoneCode: true
    })
  },
  submitInfo: function() {
    var that = this;
    wx.request({
      url: app.api.bindWXSystemPhone,
      data: {
        phonenumber: that.data.phone,
        phonecode: that.data.code,
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.status == 2000) {
          that.setData({
            count: 1500,
            toastText: "绑定成功",
            phoneCode: true,
            isBind:false
          });
          that.showToast();
        } else {
          that.setData({
            count: 1500,
            toastText: res.data.msg,
            phoneCode: true
          });
          that.showToast();
        }
      }
    })
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
  becomeHandSlap: function() {
    wx.navigateToMiniProgram({
      appId: 'wx589060f0059aa829',
      path: "pages/becomeHandSlap/becomeHandSlap",
      envVersion: envVersion,
      success: function(res) {}
    })
  },
  handSlapCenter: function(e) {
    var index = e.target.dataset.index;
    switch (index) {
      case 1:
        wx.navigateToMiniProgram({
          appId: 'wx589060f0059aa829',
          path: "pages/becomeHandSlap/becomeHandSlap",
          envVersion: envVersion,
          success: function(res) {}
        })
        break;
      case 2:
        wx.navigateToMiniProgram({
          appId: 'wx589060f0059aa829',
          path: "pages/home/index",
          envVersion: envVersion,
          success: function(res) {}
        })
        break;
    }
  },
  goMember: function() {
    wx.navigateTo({
      url: '../Member/Member'
    })
  },
  goUrl:function(e){
    const url = e.currentTarget.dataset.url;
    if (url != null && url != ""){
      if (url.indexOf('http') > -1) {
        wx.navigateTo({
          url: '../web/index?url=' + url,
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    }
  },
})