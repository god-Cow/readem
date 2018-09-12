const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const app = getApp()
Page({
  data: {
    loginBgFlag: false,
    coupon:false,
    shareFlag:false,
    isShowToast: false,
    hiGoFlag:true,
    flag: true,
    data1:[],
    data2:[],
    data3:[],
    data4:[],
    data5:[],
    data6:[],
    data7:[],
    data8:[],
    data9:[],
    data10:[],
    data11:[],
    data12:[],
    data13:[],
    data14:[],
    data15:[],
    list:[
      { 'specialId': "2384", "specialTopicId": "2460", "image":"https://img3.cloudokids.cn/h5img/specialSale/getCoupon18.png"},
      { 'specialId': "2385", "specialTopicId": "2461", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon19.png" },
      { 'specialId': "2386", "specialTopicId": "2462", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon20.png" },
      { 'specialId': "2387", "specialTopicId": "2463", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon21.png" },
      { 'specialId': "2388", "specialTopicId": "2464", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon22.png" },
      { 'specialId': "2389", "specialTopicId": "2465", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon23.png" },
      { 'specialId': "2390", "specialTopicId": "2466", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon24.png" },
      { 'specialId': "2391", "specialTopicId": "2467", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon25.png" },
      { 'specialId': "2392", "specialTopicId": "2468", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon26.png" },
      { 'specialId': "2393", "specialTopicId": "2469", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon27.png" },
    ],
    list1: [
      { 'specialId': "2399", "specialTopicId": "2475", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon28.png" },
      { 'specialId': "2400", "specialTopicId": "2476", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon29.png" },
      { 'specialId': "2401", "specialTopicId": "2477", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon30.png" },
      { 'specialId': "2402", "specialTopicId": "2478", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon31.png" },
      { 'specialId': "2403", "specialTopicId": "2479", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon32.png" },
      { 'specialId': "2404", "specialTopicId": "2480", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon33.png" },
      { 'specialId': "2405", "specialTopicId": "2481", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon34.png" },
      { 'specialId': "2406", "specialTopicId": "2482", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon35.png" }
    ],
    list2:[
      { 'specialId': "2410", "specialTopicId": "2486", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon36.png" },
      { 'specialId': "2411", "specialTopicId": "2487", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon37.png" },
      { 'specialId': "2412", "specialTopicId": "2488", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon38.png" },
      { 'specialId': "2413", "specialTopicId": "2489", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon39.png" },
    ],
    list3: [
      { 'specialId': "2418", "specialTopicId": "2494", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon40.png" },
      { 'specialId': "2419", "specialTopicId": "2495", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon41.png" },
      { 'specialId': "2420", "specialTopicId": "2496", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon42.png" },
      { 'specialId': "2421", "specialTopicId": "2497", "image": "https://img3.cloudokids.cn/h5img/specialSale/getCoupon43.png" },
    ],
    tips:"none",
    redPacketId:"",
    redPacketGroupMemberStatus:0
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
    that.getActive()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })
    that.getSpecialList()
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data
        });
        wx.getStorage({
          key: 'phoneType',
          success: function (res) {
            that.setData({
              phoneType: res.data
            });
            that.getMemberRedPacketGroupStatus()
          }
        })
      },
      fail:function(){
        that.login()
      }
    })
  },
  getMemberRedPacketGroupStatus:function(){
    var that = this;
    var token = that.data.token;
    var phonetype = that.data.phoneType;
    req.getMemberRedPacketGroupStatus(token,phonetype,6).then(res => {
      console.info(res)
      if(res.status == 2000){
        if(res.data.type==1){
          that.setData({
            redPacketId:"",
            coupon: false,
            redPacketGroupMemberStatus: 0
          })
        }
        if (res.data.type == 2){
          that.setData({
            redPacketId: res.data.redPacketGroupId,
            coupon: true,
            redPacketGroupMemberStatus: res.data.redPacketGroupMemberStatus
          })
        }
      }
      if(res.status == 2013){
        that.login()
      }
      if(res.status != 2000 && res.status != 2013){
        that.setData({
          redPacketId: "",
          coupon: false
        })
      }
    })
  },
  getSpecialList:function(){
    var that = this;
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2378&specialTopicId=2454&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success:function(res){
        if(res.data.status == 2000){
          that.setData({
            data1:res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2379&specialTopicId=2455&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data2: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2380&specialTopicId=2456&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data3: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2381&specialTopicId=2457&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data4: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2382&specialTopicId=2458&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data5: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2383&specialTopicId=2459&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data6: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2396&specialTopicId=2472&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data7: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2397&specialTopicId=2473&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data8: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2398&specialTopicId=2474&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data9: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2408&specialTopicId=2484&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data10: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2409&specialTopicId=2485&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data11: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2415&specialTopicId=2491&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data12: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2416&specialTopicId=2492&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data13: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2417&specialTopicId=2493&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data14: res.data.data.datas
          })
        }
      }
    })
    wx.request({
      url: req.baseURL + 'homepage/getSpecial?version=10000&specialId=2423&specialTopicId=2499&pageNumber=1&pageSize=10&sortInfo=&minPrice=&maxPrice=&brands=&categorySales=&colors=&values=&genders=&attrIds=&sizes=',
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            data15: res.data.data.datas
          })
        }
      }
    })
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  onShareAppMessage:function(options){
    var that = this;
    var redPacketId = that.data.redPacketId;
    that.setData({
      shareFlag:false
    })
    app.tdsdk.customShare(options)
    if (options.from == "menu") {
      return {
        title: '暑期放“价”，快来邀请好友领取880元无门槛现金礼包哦～',
        path: 'pages/getCoupon/getCoupon',
        imageUrl:"https://img3.cloudokids.cn/h5img/specialSale/getCoupon63.jpg",
      }
    }else{
      return {
        title: '暑期放“价”，快来邀请好友领取880元无门槛现金礼包哦～',
        path: 'pages/redPacket/redPacket?redPacketId=' + redPacketId,
        imageUrl: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon63.jpg",
      }
    }
  },
  tipsIn: function () {
    var that = this;
    that.setData({
      tips: "block"
    })
  },
  tipsDel: function () {
    var that = this;
    that.setData({
      tips: "none"
    })
  },
  creatRedPacket:function(){
    var that = this;
    var token = that.data.token;
    var phonetype = that.data.phoneType;
    req.shareCollection(token,phonetype,6).then(res =>{
      if(res.status == 2000){
        if(res.data.flag){
          that.setData({
            shareFlag: true,
            coupon: true,
            redPacketId: res.data.redPacketGroup.id
          })
          that.getMemberRedPacketGroupStatus()
        }else{
          that.setData({
            shareFlag: false,
            coupon: true,
            redPacketId: "",
            count: 1500,
            toastText: res.data.msg
          })
          that.showToast();
        }
      }
      if(res.status == 2013){
        that.login()
      }
      if(res.status != 2000 && res.status != 2013){
        that.setData({
          count: 1500,
          toastText: res.msg
        });
        that.showToast();
      }
    })
  },
  login:function(){
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: function (r) {
              var code = r.code;//登录凭证
              if (code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res) {
                    that.setData({
                      userInfo: res.userInfo
                    });
                    app.globalData.userInfo = res.userInfo;
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    that.getUserInfoLogin(res.encryptedData, res.iv, code)
                  }
                })
              }
            }
          });
        } else {
          that.setData({
            loginBgFlag: true
          })
        }
      }
    })
  },
  getUserInfoLogin: function (encryptedData, iv, code) {
    var that = this;
    wx.request({
      url: app.api.weChatAppletLogin,//自己的服务接口地址
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: code,
      },
      success: function (data) {
        if (data.data.status == 2000) {
          var token = data.data.data.token;
          var phoneType = data.data.data.phonetype;
          var memberId = data.data.data.userInfo.id;
          that.setData({
            token: token,
            phoneType: phoneType,
            memberId: memberId,
            loginBgFlag: false
          });
          wx.setStorageSync('token', token);
          wx.setStorageSync('phoneType', phoneType);
          wx.setStorageSync('memberId', memberId);
          that.getMemberRedPacketGroupStatus()
        }
      }
    })
  },
  bindGetUserInfo: function () {
    var that = this;
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
                loginBgFlag: false
              });
              app.globalData.userInfo = res.userInfo;
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              that.getUserInfoLogin(res.encryptedData, res.iv, code)
            }
          })
        }
      }
    });
  },
  goPlan:function(){
    var that = this;
    if(that.data.redPacketGroupMemberStatus==0){
      wx.navigateTo({
        url: '../redPacket/redPacket?redPacketId=' + that.data.redPacketId,
      })
    }else{
      wx.navigateTo({
        url: '../redPacketCoupon/redPacketCoupon'
      })
    }
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        flag: false
      })
    }, 2000)
  },
  disapper: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag
    if (!flag) {
      that.setData({
        flag: true
      })
    } else {
      that.setData({
        flag: false
      })
    }
  },
  goIndex: function (e) {
    wx.switchTab({
      url: '../../pages/home/index',
    })
  },
  go: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    switch (id) {
      case "1":
        that.setData({
          toView: 'inToViewA'
        })
        break;
      case "2":
        that.setData({
          toView: 'inToViewB'
        })
        break;
      case "3":
        that.setData({
          toView: 'inToViewC'
        })
        break;
      case "4":
        that.setData({
          toView: 'inToViewD'
        })
        break;
      case "5":
        that.setData({
          toView: 'inToViewE'
        })
        break;
      case "6":
        that.setData({
          toView: 'inToViewF'
        })
        break;
    }
  },
  getActive: function () {
    var that = this;
    wx.request({
      url: app.api.getActiveFlag,
      success: function (res) {
        if (res.data.status == 2000) {
          if (res.data.data.flag) {
            that.setData({
              hiGoFlag: true
            })
          } else {
            that.setData({
              hiGoFlag: false
            })
          }
        }
      }
    })
  },
})