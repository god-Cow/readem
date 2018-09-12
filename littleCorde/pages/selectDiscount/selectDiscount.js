//获取应用实例
var app = getApp()
Page({
  data: {
    isShowToast: false,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    token: "",
    phoneType: "",
    coupon: [],
    discount: [],
    selectDiscount: "",
    hidden: true,
    hidden1: true
  },
  onLoad:function(options){
    var that = this;
    var pageCome = options.pageCome;
    that.setData({
      pageCome:pageCome,
      hidden: false,
    })
    if(pageCome==2){
      that.setData({
        skuId: options.skuId
      })
    }
  },
  onShow: function () {
    var that = this;
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
            that.getData()
          },
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /* 滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    if(that.data.pageCome==1){
      if (that.data.currentTab == 0) {
        that.getData()
      }
      if (that.data.currentTab == 1) {
        that.setData({
          hidden1: false
        })
        wx.request({
          url: app.api.getDiscountCardList,
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6,
            type: 2
          },
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          success: function (newRes) {
            if (newRes.data.status == 2000) {
              that.setData({
                discount: newRes.data.data,
                hidden1: true
              })
            }
          }
        })
      }
    }
    if(that.data.pageCome==2){
      if (that.data.currentTab == 0) {
        that.getData()
      }
      if (that.data.currentTab == 1) {
        that.setData({
          hidden1: false
        })
        wx.request({
          url: app.api.listDiscountCard,
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6,
            type: 2,
            skuId: that.data.skuId
          },
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          success: function (newRes) {
            if (newRes.data.status == 2000) {
              that.setData({
                discount: newRes.data.data,
                hidden1: true
              })
            }
          }
        })
      }
    }
  },
  /* 点击tab切换 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  disCountClick: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.indedx;
    that.data.coupon.forEach(function (v, i) {
      if (v.cardNumber == index) {
        if (v.flag) {
          v.flag = false,
            wx.setStorage({
              key: 'discount',
              data: '',
            })
        } else {
          v.flag = true,
            wx.setStorage({
              key: 'discount',
              data: v.cardNumber,
            })
        }
      } else {
        v.flag = false
      }
    })
    that.setData({
      coupon: that.data.coupon
    })
  },
  convert: function () {
    var that = this;
    wx.navigateBack({
      delta: 1
    })
  },
  getData: function () {
    var that = this;
    if(that.data.pageCome==1){
      wx.request({
        url: app.api.getDiscountCardList,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: 6,
          type: 1
        },
        header: {
          "content-type": "application/json"
        },
        method: "GET",
        success: function (newRes) {
          if (newRes.data.status == 2000) {
            that.setData({
              coupon: []
            })
            for (var i = 0; i < newRes.data.data.length; i++) {
              that.data.coupon.push({
                title: newRes.data.data[i].title,
                cardNumber: newRes.data.data[i].cardNumber,
                beginTime: newRes.data.data[i].beginTime,
                endTime: newRes.data.data[i].endTime,
                description: newRes.data.data[i].description,
                value: newRes.data.data[i].value,
                applyVo: newRes.data.data[i].applyVo,
                flag: false,
                type: newRes.data.data[i].type
              })
            }
            that.setData({
              coupon: that.data.coupon,
              hidden: true,
            })
            wx.getStorage({
              key: 'discount',
              success: function (res) {
                that.setData({
                  selectDiscount: res.data
                })
                var discount = that.data.selectDiscount;
                that.data.coupon.forEach(function (v, i) {
                  if (v.cardNumber == discount) {
                    v.flag = true
                  }
                })
                that.setData({
                  coupon: that.data.coupon,
                  hidden: true,
                })
              }
            })
          }
        }
      })
    }
    if(that.data.pageCome==2){
      wx.request({
        url: app.api.listDiscountCard,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: 6,
          type: 1,
          skuId:that.data.skuId
        },
        header: {
          "content-type": "application/json"
        },
        method: "GET",
        success: function (newRes) {
          if (newRes.data.status == 2000) {
            that.setData({
              coupon: []
            })
            for (var i = 0; i < newRes.data.data.length; i++) {
              that.data.coupon.push({
                title: newRes.data.data[i].title,
                cardNumber: newRes.data.data[i].cardNumber,
                beginTime: newRes.data.data[i].beginTime,
                endTime: newRes.data.data[i].endTime,
                description: newRes.data.data[i].description,
                value: newRes.data.data[i].value,
                applyVo: newRes.data.data[i].applyVo,
                flag: false,
                type: newRes.data.data[i].type
              })
            }
            that.setData({
              coupon: that.data.coupon,
              hidden: true,
            })
            wx.getStorage({
              key: 'discount',
              success: function (res) {
                that.setData({
                  selectDiscount: res.data
                })
                var discount = that.data.selectDiscount;
                that.data.coupon.forEach(function (v, i) {
                  if (v.cardNumber == discount) {
                    v.flag = true
                  }
                })
                that.setData({
                  coupon: that.data.coupon,
                  hidden: true,
                })
              }
            })
          }
        }
      })
    }
  },
  covertCard: function () {
    var that = this;
    var cardNumber = that.data.cardNumber;
    if (cardNumber != null && cardNumber != ""){
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
            toastText: title
          });
          that.showToast();
          that.setData({
            cardNumber: ""
          })
          that.getData();
        }
      })
    }else{
      that.setData({
        count: 1500,
        toastText: "请输入优惠卡号"
      });
      that.showToast();
    }
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
  card: function (e) {
    var that = this;
    that.setData({
      cardNumber: e.detail.value
    })
  },
})
