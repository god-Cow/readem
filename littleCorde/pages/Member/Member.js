var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
const pid = 38;
Page({
  data: {
    autoplay:false,
    current:"1",
    current2:"1",
    token:"",
    phonetype:"",
    MemberData:{},
    percentage:"",
    percentage2:"",
    percentage3:"",
  },
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (result) {
            that.setData({
              phoneType: result.data
            })
            wx.request({
              url: app.api.getMemberLevel,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              success: function (res) {
                if (res.data.status == 2000) {
                  var percentage3=res.data.data.level + 1 >= 4 ? 4 : res.data.data.level
                  that.setData({
                    MemberData: res.data.data,
                    current: res.data.data.level-1,
                    current2: res.data.data.level,
                    percentage: 100 * res.data.data.percentage+ "%",
                    percentage2: 592 * res.data.data.percentage-12,
                    percentage3: 25 * percentage3 + "%",
                  })
                }
              }
            })
          },
        })
      },
    });
    req.analyticsLog({
      event: 'view',
      pid
    });
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  bindchange:function(e){
    var that=this;
    that.setData({
      current2: e.detail.current+1
    })
  }
})