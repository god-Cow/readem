var app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
Page({
  data: {
    status:0,
    token: "",
    phoneType: "",
    orderShop: [],
    orderInfo: {},
    orderId: "",
    numberGroupId: "",
    getGroupIsRookieGroup: {},
    endTime: "0:0:0",
    getGroupIsRookieGroupFlag: false,
    activityId: "",
  },
  onLoad: function (options) {
    console.info(options)
    var that = this;
    var orderId = options.orderId;
    that.setData({
      orderId: orderId
    })
    wx.setNavigationBarTitle({
      title: "核对订单#" + orderId,
    })
    that.getGroupIsRookieGroup()
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
              url: app.api.getOrderParcelInfoByOrderSn,
              data: {
                orderSn: orderId,
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: "6"
              },
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success: function (data) {
                console.info(data)
                if (data.data.status == 2000) {
                  that.setData({
                    orderShop: data.data.data
                  })
                }
              }
            })
            wx.request({
              url: app.api.getOrderByMemberIdOrderSn,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                orderSn: orderId,
                channel: 6
              },
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success: function (newData) {
                if (newData.data.status == 2000) {
                  that.setData({
                    orderInfo: newData.data.data
                  })
                }
              }
            })
          },
        })
      },
    })
  },
  payOrder: function () {
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
                  if (that.data.getGroupIsRookieGroup.groupType == 5){
                    wx.navigateTo({
                      url: '../collagePaysucess/collagePaysucess?path=' + that.data.orderId,
                    });
                  }else{
                    wx.navigateTo({
                      url: '../success/success?orderId=' + that.data.orderId,
                    });
                  }
                },
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
  goExpressSn: function (e) {
    wx.navigateTo({
      url: '../express/express?expressSn=' + e.currentTarget.dataset.id
    })
  },
  getGroupIsRookieGroup: function () {
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getGroupIsRookieGroup(token, phonetype, 6, "", that.data.orderId, 3, "").then(res => {
      if (res.status == 2000) {
        if (res.data.outcome) {
          var length = res.data.members.length;
          var arr = [];
          for (var i = 0; i < length; i++) {
            arr.push({
              avatar: res.data.members[i].imgUrl,
              nickname: res.data.members[i].nickname,
              flag: res.data.members[i].flag
            })
          }
          if (length == res.data.amount) {

          } else {
            for (var a = 0; a < res.data.amount - length; a++) {
              arr.push({
                avatar: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon45.png",
                nickname: "等待中...",
                flag: 0
              })
            }
          }
          that.setData({
            numberGroupId: res.data.groupId,
            getGroupIsRookieGroupFlag: true,
            activityId: res.data.activityId,
            getGroupIsRookieGroup: {
              endTime: that.time(res.data.endTime),
              flag: res.data.flag,
              number: res.data.number,
              status: res.data.status,
              members: arr,
              isBuy: res.data.isBuy,
              unpaid: res.data.unpaid,
              amount:res.data.amount,
              groupType: res.data.type
            }
          })
        } else {
          that.setData({
            numberGroupId: "",
            activityId: "",
            getGroupIsRookieGroup: {},
            getGroupIsRookieGroupFlag: false
          })
        }
      }
    })
  },
  time: function (time) {
    var that = this;
    var interval = setInterval(function () {
      var second = time--;
      let hour = Math.floor(second / 3600);
      var hrStr = hour.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      let sed = Math.floor(second % 3600 / 60);
      var minStr = sed.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      let mms = Math.floor(second % 3600 % 60)
      var secStr = mms.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (second < 0) {
        clearInterval(interval)
        that.setData({
          endTime: "0:0:0"
        })
      } else {
        that.setData({
          endTime: hrStr + ":" + minStr + ":" + secStr
        })
      }
    }.bind(this), 1000);
  },
  // onShareAppMessage: function (options) {
  //   var that = this;
  //   app.tdsdk.customShare(options)
  //   return {
  //     title: "好友喊你一起来拼团，全网最低价【14.9元】无痕内裤舒适体验",
  //     path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_5_2_" + that.data.numberGroupId,
  //     imageUrl: "https://img3.cloudokids.cn/h5img/promotion/card112.jpg",
  //     success: function (res) {

  //     },
  //   }
  // },
})