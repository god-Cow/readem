var app = getApp();
Page({
  data: {
    token: "",
    phoneType: "",
    bargainId: "",
    memberId: "",
    list: [],
    record: {},
  },
  onLoad: function (options) {
    var that = this;
    if (options.bargainId != undefined && options.bargainId != null && options.bargainId != "") {
      that.setData({
        bargainId: options.bargainId,
      });
    }
  },
  onReady: function () {

  },
  onShow: function () {
    var that=this;
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId: res.data,
        });
        wx.getStorage({
          key: 'token',
          success: function (res) {
            that.setData({
              token: res.data,
            });
            wx.getStorage({
              key: 'phoneType',
              success: function (res) {
                that.setData({
                  phoneType: res.data,
                });
                if (that.data.bargainId != undefined && that.data.bargainId != null && that.data.bargainId != "") {
                  wx.request({
                    url: app.api.recordUrl,
                    data: {
                      token: that.data.token,
                      phonetype: that.data.phoneType,
                      channel: 6,
                      bargainId: that.data.bargainId
                    },
                    method: "GET",
                    success: function (data) {
                      if (data.data.status == 2000) {
                        that.setData({
                          list: data.data.data,
                        });
                      }
                    }
                  });
                  wx.request({
                    url: app.api.rangeUrl,
                    data: {
                      token: that.data.token,
                      phonetype: that.data.phoneType,
                      channel: 6,
                      bargainId: that.data.bargainId
                    },
                    method: "GET",
                    success: function (data) {
                      if (data.data.status == 2000) {
                        that.setData({
                          record: data.data.data,
                        });
                      }
                    }
                  });
                } else {
                  wx.request({
                    url: app.api.rangeUrl,
                    data: {
                      token: that.data.token,
                      phonetype: that.data.phoneType,
                      channel: 6,
                    },
                    method: "GET",
                    success: function (data) {
                      if (data.data.status == 2000) {
                        that.setData({
                          record: data.data.data,
                        });
                      }
                    }
                  });
                  wx.request({
                    url: app.api.recordUrl,
                    data: {
                      token: that.data.token,
                      phonetype: that.data.phoneType,
                      channel: 6
                    },
                    method: "GET",
                    success: function (data) {
                      if (data.data.status == 2000) {
                        console.log(2)
                          that.setData({
                            list: data.data.data,
                          });
                        
                      }
                    }
                  });
                }
              },
            })
          },
        });
      },
    })
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

  }
})