const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const app = getApp()
Page({
  data: {
    hiGoFlag: true,
    redPacketId:"",
    currentQuantity: 0,
    remainingQuantity: 0,
    list: [],
    isCreatedByCurrentMember:false,
    condition:false,
    type:"",
    loginBgFlag: false,
    redPacketGroupMemberStatus: 0
  },
  onLoad: function (options) {
    var redPacketId = options.redPacketId;
    console.info(redPacketId)
    var that = this;
    that.getActive()
    that.setData({
      redPacketId: redPacketId
    })
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
            that.showRedPacketGroupProgress()
          }
        })
      },
      fail: function () {
        that.login()
      }
    })
  },
  login: function () {
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
          that.showRedPacketGroupProgress()
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
  showRedPacketGroupProgress:function(){
    var that = this;
    var token = that.data.token;
    var phonetype = that.data.phoneType;
    req.showRedPacketGroupProgress(token, phonetype, 6, that.data.redPacketId).then(res => {
      console.info(res)
      if(res.status == 2000){
        var length = res.data.memberList.length;
        var arr = [];
        for (var i = 0; i < length; i++) {
          arr.push({
            avatar: res.data.memberList[i].avatar,
            nickname: res.data.memberList[i].nickname,
            flag:true
          })
        }
        if(length == 3){
          
        }else{
          for(var a = 0; a < 3-length; a++){
            arr.push({
              avatar: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon45.png",
              nickname: "等待中...",
              flag: false
            })
          }
        }
        that.setData({
          currentQuantity: res.data.currentQuantity,
          remainingQuantity: res.data.remainingQuantity,
          isCreatedByCurrentMember: res.data.isCreatedByCurrentMember,
          list: arr,
          condition: res.data.flag,
          type: res.data.type,
          redPacketGroupMemberStatus: res.data.redPacketGroupMemberStatus
        })
      }
      if(res.status == 2013){
        that.login()
      }
    })
  },
  onShareAppMessage:function(options){
    var that = this;
    var redPacketId = that.data.redPacketId;
    app.tdsdk.customShare(options)
    return {
      title: '暑期放“价”，快来邀请好友领取880元无门槛现金礼包哦～',
      path: 'pages/redPacket/redPacket?redPacketId=' + redPacketId,
      imageUrl: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon63.jpg",
    }
  },
  goRedPacket:function(){
    var that = this;
    var token = that.data.token;
    var phonetype = that.data.phoneType;
    req.joinRedPacketGroup(token, phonetype, 6, that.data.redPacketId).then(res=>{
      console.info(res)
      if(res.status == 2000){
        if(res.data.flag){
          wx.showToast({
            icon:"none",
            title: res.data.msg,
          })
          that.showRedPacketGroupProgress()
        }else{
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        }
      }
    })
  },
  goPlay:function(){
    wx.navigateTo({
      url: '../getCoupon/getCoupon',
      success:function(){
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
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
  getRedPacket:function(){
    var that = this;
    var token = that.data.token;
    var phonetype = that.data.phoneType;
    req.updateRedPacketGroupStatus(token, phonetype, 6, that.data.redPacketId).then(res => {
      console.info(res)
      if (res.status == 2000) {
        if(res.data.flag){
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
          that.showRedPacketGroupProgress()
          setTimeout(function(){
            wx.navigateTo({
              url: '../redPacketCoupon/redPacketCoupon',
            })
          },1500)
        }else{
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        }
      }else{
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  }
})