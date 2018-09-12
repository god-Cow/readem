var app = getApp();
Page({
  data: {
    token:"",
    phoneType:"",
    cardNumber:"",
    index:"",
    isShowToast:false,
    disabled:false
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
      index:options.index
    })
    wx.setNavigationBarTitle({
      title: '兑换'+ options.index,
    })
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token:res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function(result) {
            that.setData({
              phoneType: result.data
            })
          },
        })
      },
    })
  },
  card:function(e){
    var that = this;
    that.setData({
      cardNumber: e.detail.value
    })
  },
  convert:function(){
    var that = this;
    var index = that.data.index;
    var cardNumber = that.data.cardNumber;
    that.setData({
      disabled:true
    })
    if (cardNumber != null && cardNumber != ""){
      if (index == "礼品卡") {
        wx.request({
          url: app.api.activeCard,
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6,
            cardNumber: cardNumber,
            type: 2
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (data) {
            var title = data.data.msg;
            that.setData({
              count: 1500,
              toastText: title,
              disabled: false
            });
            that.showToast();
            setTimeout(function () {
              wx.navigateTo({
                url: '../../pages/discount/discount?currentTab=0',
                success: function () {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();
                }
              })
            }, 1500)
          }
        })
      }
      if (index == "优惠券") {
        wx.request({
          url: app.api.activeCard,
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6,
            cardNumber: cardNumber,
            type: 1
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (data) {
            var title = data.data.msg;
            that.setData({
              count: 1500,
              toastText: title,
              disabled: false
            });
            that.showToast();
            setTimeout(function () {
              wx.navigateTo({
                url: '../../pages/discount/discount?currentTab=1',
                success: function () {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();
                }
              })
            }, 1500)
          }
        })
      }
    }else{
      that.setData({
        count: 1500,
        toastText: "请输入卡号"
      });
      that.showToast();
    }
  }
})