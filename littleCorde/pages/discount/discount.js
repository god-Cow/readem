//获取应用实例
const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 20;

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    token: "",
    phoneType: "",
    coupon: [],
    discount: [],
  },
  onLoad: function(options) {
    var current = options.currentTab;
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          currentTab: current
        });
      }
    })
    req.analyticsLog({
      event: 'view',
      pid
    });
  },
  onShow: function() {
    var that = this;
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
              url: app.api.getCardList,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6,
                type: "1"
              },
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success: function(newRes) {
                if (newRes.data.status == 2000) {
                  that.setData({
                    coupon: newRes.data.data
                  })
                }
              }
            })
          },
        })
      },
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /* 滑动切换tab */
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (that.data.currentTab == 0) {
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
                url: app.api.getCardList,
                data: {
                  token: that.data.token,
                  phonetype: that.data.phoneType,
                  channel: 6,
                  type: "1"
                },
                header: {
                  "content-type": "application/json"
                },
                method: "GET",
                success: function(newRes) {
                  if (newRes.data.status == 2000) {
                    that.setData({
                      coupon: newRes.data.data
                    })
                  }
                }
              })
            },
          })
        },
      })
    }
    if (that.data.currentTab == 1) {
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
                url: app.api.getCardList,
                data: {
                  token: that.data.token,
                  phonetype: that.data.phoneType,
                  channel: 6,
                  type: "2"
                },
                header: {
                  "content-type": "application/json"
                },
                method: "GET",
                success: function(newRes) {
                  if (newRes.data.status == 2000) {
                    that.setData({
                      discount: newRes.data.data
                    })
                  }
                }
              })
            },
          })
        },
      })
    }
  },
  /* 点击tab切换 */
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  convert: function(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../pages/convert/convert?index=' + index,
    })
  },
  goDiscount: function(e) {
    var activityurlvo = e.currentTarget.dataset.activityurlvo;
    var brandid = e.currentTarget.dataset.brandid;
    var categoryid = e.currentTarget.dataset.categoryid;
    var specialid = e.currentTarget.dataset.specialid;
    var begintime = e.currentTarget.dataset.begintime.replace(/-/g, '/');
    console.info(e)
    var timenow = Date.parse(new Date()) / 1000;
    var date = new Date(begintime);
    var time = Date.parse(date).toString().substring(0, 10)
    if (timenow > time) {
      if (activityurlvo != null && activityurlvo != "") {
        if (activityurlvo.weixin != null && activityurlvo.weixin != "") {
          wx.navigateTo({
            url: activityurlvo.weixin,
          })
        }
      } else {
        if (brandid != null && brandid != "") {
          wx.navigateTo({
            url: '../newStyle/newStyle?specialId=' + brandid + "&pageCome=3",
          })
        } else {
          if (categoryid != null && categoryid != "") {
            wx.navigateTo({
              url: '../newStyle/newStyle?specialId=' + categoryid + "&pageCome=2",
            })
          } else {
            if (specialid != null && specialid != "") {
              wx.navigateTo({
                url: '../newStyle/newStyle?specialId=' + specialid + "&pageCome=1",
              })
            } else {
              wx.switchTab({
                url: '../home/index',
              })
            }
          }
        }
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '活动将于' + begintime + '开始',
        showCancel: false
      })
    }
  }
})