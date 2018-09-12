var app = getApp();
Page({
  data: {
    isShowToast: false,
    spuId: "",
    matchData: [],
    token:"",
    phoneType:""
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
  onLoad: function (options) {
    var that = this;
    that.setData({
      spuId: options.spuId
    })
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
              url: app.api.getCollageBySpuId,
              method: 'GET',
              data: {
                spuId: that.data.spuId,
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                that.setData({
                  matchData: res.data.data
                })
              }
            })
          }
        })
      }
    })
  },
  skip: function (e) {
    var buyerId = e.target.dataset.id;
    wx.redirectTo({
      url: '../../pages/buyer/buyer?buyerId=' + buyerId,
    })
  },
  addCollageLike: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var token = that.data.token;
    var phoneType = that.data.phoneType;
    if (token != null && token != "" && phoneType != null && phoneType != "") {
      wx.request({
        url: app.api.addCollageLike,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: 6,
          collageId: id
        },
        header: {
          "content-type": "application/json"
        },
        method: "GET",
        success: function (res) {
          if (res.data.status == 2000) {
            that.setData({
              count: 1500,
              toastText: "搭配点赞成功！"
            });
            that.showToast();
            wx.request({
              url: app.api.getCollageBySpuId,
              method: 'GET',
              data: {
                spuId: that.data.spuId,
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                that.setData({
                  matchData: res.data.data
                })
              }
            });
          }
        }
      })
    }
  },
})