var app = getApp()
var app = getApp()
Page({
  data: {
    isShowToast: false,
    groupId: "",
    spuId: "",
    countDownHour: 0, //倒计时
    countDownMinute: 0,
    countDownSecond: 0,
    getGoodsSkuBySpuId: [],
    display: "none",
    disabled: true,
    shareBtn1:"none",
    shareBtn2:"none",
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
    var path = options.path;
    var scene = decodeURIComponent(options.scene)
    if (path != null && path != "" && path != undefined) {
      that.setData({
        groupId: path.split("_")[0],
        spuId: path.split("_")[1],
        groupCode: path.split("_")[2],
      })
      that.getList()
    }
    if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
      wx.request({
        url: app.api.changeUrl,
        data: {
          id: scene
        },
        success: function (res) {
          if (res.data != null) {
            var qrCodePath = res.data;
            qrCodePath = qrCodePath.substring(5);
            that.setData({
              groupId: qrCodePath.split("_")[0],
              spuId: qrCodePath.split("_")[1],
              groupCode: qrCodePath.split("_")[2],
            })
            that.getList()
          }
        }
      })
    }
  },
  getList:function(){
    var that = this;
    wx.request({
      url: app.api.getGoodsDetail,
      data: {
        spuId: that.data.spuId
      },
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            shopInfo: res.data.data.categorySaleGoodsResult,
            goodsCost: res.data.data.categorySaleGoodsResult.salePrice,
          })
        }
      }
    })
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              });
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: app.api.weChatAppletLogin,//自己的服务接口地址
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code,
                },
                success: function (data) {
                  console.info(data)
                  if (data.data.status == 2000) {
                    var token = data.data.data.token;
                    var phoneType = data.data.data.phonetype;
                    var memberId = data.data.data.userInfo.id;
                    that.setData({
                      token: token,
                      phoneType: phoneType,
                      memberId: memberId
                    });
                    wx.setStorageSync('token', token);
                    wx.setStorageSync('phoneType', phoneType);
                    wx.setStorageSync('memberId', memberId);
                    app.globalData.isBind = data.data.data.isBind;
                    that.getGroupInfo()
                    that.getBind()
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  getGroupInfo:function(){
    var that = this;
    wx.request({
      url: app.api.getGroupInfo,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: that.data.groupId,
        activeId: "",
        groupType: "4",
        activeStatus: "1",
      },
      dataType: "json",
      method: "GET",
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            time: data.data.data.endTime,
            groupNumber: parseInt(2) - parseInt(data.data.data.number),
            status:data.data.data.status
          })
          that.getData()
        }
        if (data.data.data.status == 1 || data.data.data.status == 3 || data.data.data.status == 2){
          that.setData({
            shareBtn1: "none",
            shareBtn2: "block",
          }) 
        }
        if (data.data.data.status == 0){
          if (that.data.groupNumber > 0) {
            that.setData({
              shareBtn1: "block",
              shareBtn2: "none",
            })
          } else {
            that.setData({
              shareBtn1: "none",
              shareBtn2: "block",
            })
          }
        }
      }
    })
  },
  getData: function () {
    var that = this;
    var interval = setInterval(function () {
      var totalSecond = that.data.time - Date.parse(new Date()) / 1000;
      var day = Math.floor(totalSecond / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      var hr = Math.floor((totalSecond - Math.floor(totalSecond / 3600 / 24) * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      var min = Math.floor((totalSecond - Math.floor(totalSecond / 3600 / 24) * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      var sec = totalSecond - Math.floor(totalSecond / 3600 / 24) * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      that.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      if (totalSecond < 0) {
        that.setData({
          countDownDay: "0",
          countDownHour: '0',
          countDownMinute: '0',
          countDownSecond: '0',
        });
      }
    }.bind(this), 1000);
  },
  getBind:function(){
    var that = this;
    wx.request({
      url: app.api.bindMemberIntroduce,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        introduceCode: that.data.groupCode
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res)
        if (res.data.status == 2000) {

        }
      }
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../home/index',
      success: function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad()
      }
    })
  },
  joinGroup:function(){
    var that = this;
    console.info(that.data.token);
    console.info(that.data.phoneType);
    console.info(that.data.groupId);
    wx.request({
      url: app.api.joinGroupBooking,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: that.data.groupId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (result) {
        console.info(result)
        if (result.data.status == 2000) {
          that.setData({
            count: 3000,
            toastText: result.data.data,
          });
          that.showToast();
          if (result.data.data == "拼单成功") {
            that.getGoodsSkuBySpuId();
          } else {
            that.setData({
              count: 3000,
              toastText: "参团失败",
            });
            that.showToast();
          }
        } else {
          that.setData({
            count: 3000,
            toastText: result.data.msg,
          });
          that.showToast();
        }
      }
    })
  },
  goDetial:function(){
    var that = this;
    wx.navigateTo({
      url: '../detail/detail?spuId=' + that.data.spuId,
    })
  },
  getGoodsSkuBySpuId: function () {
    var that = this;
    var spuId = that.data.spuId;
    wx.request({
      url: app.api.getGoodsSkuBySpuId,
      data: {
        spuId: spuId
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            getGoodsSkuBySpuId: []
          })
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.getGoodsSkuBySpuId.push({
              id: res.data.data[i].id,
              stock: res.data.data[i].stock,
              specificationValue: res.data.data[i].specificationValue,
              salePrice: res.data.data[i].salePrice,
              msg: res.data.data[i].msg,
              cartId: res.data.data[i].cartId,
              hidden: "none",
            })
          }
          that.setData({
            getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
          })
          if (that.data.display == "none") {
            that.setData({
              display: "block",
            })
          } else {
            that.setData({
              display: "none",
            })
          }
        }
      }
    })
  },
  //选择尺码
  selectSize: function (e) {
    var that = this;
    var stock = e.target.dataset.stock;
    var id = e.target.dataset.id;
    var flag = that.data.flag;
    var price = e.target.dataset.price;
    if (stock != 0) {
      that.setData({
        disabled: false
      })
      that.data.getGoodsSkuBySpuId.forEach(function (v, i) {
        if (v.id == id) {
          if (v.hidden == "none") {
            v.hidden = "block";
            that.setData({
              flag: false,
              goodsCost: price,
            })
          } else {
            v.hidden = "none";
            that.setData({
              flag: true,
              disabled: true,
              goodsCost: that.data.salePrice,
            })
          }
        } else {
          v.hidden = "none";
        }
      })
      that.setData({
        getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
      })
    }
  },
  disappear: function () {
    var that = this;
    that.setData({
      display: "none",
      disabled: true,
    })
  },
  addCart: function (e) {
    var that = this;
    var skuId;
    var cartId;
    that.data.getGoodsSkuBySpuId.forEach(function (v, i) {
      if (v.hidden == "block") {
        skuId = v.id;
        cartId = v.cartId
      }
    })
    wx.navigateTo({
      url: '../purchaseNow/purchaseNow?path=3_' + skuId + "_" + cartId + "_" + that.data.groupId,
    })
  },
})