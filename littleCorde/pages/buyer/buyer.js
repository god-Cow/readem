var app = getApp();
Page({
  data: {
    buyerInfo:{},
    buyerCollage:[],
    token:"",
    phoneType:"",
    isShowToast:false
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
    var buyerId = options.buyerId;
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
              url: app.api.getCollageByCollageId,
              data: {
                collageId: buyerId,
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success: function (res) {
                if (res.data.status == 2000) {
                  that.setData({
                    buyerInfo: res.data.data
                  })
                }
              }
            })
          }
        })
      },
      fail:function(){
        wx.request({
          url: app.api.getCollageByCollageId,
          data: {
            collageId: buyerId
          },
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          success: function (res) {
            if (res.data.status == 2000) {
              that.setData({
                buyerInfo: res.data.data
              })
            }
          }
        })
      }
    }),   
    wx.request({
      url: app.api.getCollageSPUByCollageId,
      data:{
        collageId: buyerId
      },
      header:{
        "content-type":"application/json"
      },
      method:"GET",
      success:function(res){
        if(res.data.status == 2000){
          that.setData({
            buyerCollage:res.data.data
          })
        }
      }
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
            that.data.buyerInfo.isLike = 1;
            that.setData({
              buyerInfo: that.data.buyerInfo
            })
          }
        }
      })
    }
  },
  go: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
})