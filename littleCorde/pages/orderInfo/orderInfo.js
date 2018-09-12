const app = getApp()
const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 15;

Page({
  data: {
    token:"",
    phoneType:"",
    orderShop:[],
    orderInfo:{},
    orderId:"",
  },
  onLoad: function (options) {
    var that = this;
    app._dgt.trackEvent('goDetail');
    var orderId = options.orderId;
    that.setData({
      orderId: orderId
    })
    wx.setNavigationBarTitle({
      title: "核对订单#" + orderId,
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
              phoneType:result.data
            })
            wx.request({
              url: app.api.getOrderParcelInfoByOrderSn,
              data:{
                orderSn: orderId,
                token:that.data.token,
                phonetype:that.data.phoneType,
                channel:"6"
              },
              header:{
                "content-type":"application/json"
              },
              method:"GET",
              success:function(data){
                console.info(data)
                if(data.data.status == 2000){
                  that.setData({
                    orderShop:data.data.data
                  })
                }
              }
            })
            wx.request({
              url: app.api.getOrderByMemberIdOrderSn,
              data:{
                token: that.data.token,
                phonetype:that.data.phoneType,
                orderSn:orderId,
                channel:6
              },
              header:{
                "content-type":"application/json"
              },
              method:"GET",
              success:function(newData){
                if(newData.data.status == 2000){
                  that.setData({
                    orderInfo:newData.data.data
                  })
                }
              }
            })
          },
        })
      },
    })
  },
  payOrder:function(){
    var that = this;
    var userCode;
    wx.login({
      success: function (r) {
        userCode = r.code;
        wx.request({
          url: app.api.weChatAppletPay,
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6,
            orderSn: that.data.orderId,
            payMoney: that.data.orderInfo.payMoney,
            payId: 2,
            code: userCode
          },
          success: function (result) {
            var timeStamp = result.data.data.timeStamp;
            var nonceStr = result.data.data.nonceStr;
            var packageNew = result.data.data.package;
            var signNew = result.data.data.sign;
            wx.requestPayment(
              {
                'timeStamp': timeStamp,
                'nonceStr': nonceStr,
                'package': packageNew,
                'signType': 'MD5',
                'paySign': signNew,
                'success': function (res) {
                  wx.navigateTo({
                    url: '../../pages/success/success?orderId=' + that.data.orderId,
                  });
                },
                'fail': function (res) {

                },
                'complete': function (res) {
                
                }
              })
          }
        })
      }
    });
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  goExpressSn:function(e){
    wx.navigateTo({
      url: '../express/express?expressSn=' + e.currentTarget.dataset.id
    })
  }
})