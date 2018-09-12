var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
const pid = 40;
Page({
  data: {
    buyerdata: {},
    ishow: false
  },
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data,
        })
        wx.getStorage({
          key: 'phoneType',
          success: function(res) {
            that.setData({
              phoneType: res.data,
            })
            wx.request({
              url: app.api.getMemberHistory,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              dataType: "json",
              success: function(res) {
                if (res.data.status == 2000) {
                  that.setData({
                    ishow:res.data.data.orderMember,
                    buyerdata: res.data.data
                  })
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
    });
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})