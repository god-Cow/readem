const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
Page({
  data: {
    siteList: [],
    loginBgFlag:false
  },
  onLoad(options){
    const that = this;
    let token = wx.getStorageSync('token');
    let phonetype = wx.getStorageSync('phoneType');
    if (token && phonetype) {
      that.setData({
        token,
        phonetype
      })
    } else {
      that.setData({ loginBgFlag: true })
      //去登录
    }
    if (options) {
      let activityId = options.activityId;
      let activityType = options.groupType;
      let groupCode = options.groupCode || '';
      let userId = options.userId || '';
      var scene = decodeURIComponent(options.scene)
      if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
        wx.request({
          url: app.api.changeUrl,
          data: {
            id: scene
          },
          success: function (res) {
            if (res.data != null) {
              var qrCodePath = res.data;
              console.info(qrCodePath)
              console.info(qrCodePath.split("&")[0].split("=")[1])
              console.info(qrCodePath.split("&")[1].split("=")[1])
              console.info(qrCodePath.split("&")[2].split("=")[1])
              that.setData({
                activityId: qrCodePath.split("&")[0].split("=")[1],
                activityType: qrCodePath.split("&")[1].split("=")[1],
                groupCode: qrCodePath.split("&")[2].split("=")[1],
                userId: qrCodePath.split("&")[3].split("=")[1],
              })
              that.getShareMessage()
            }
          }
        })
      } else {
        that.setData({
          activityId: activityId ,
          activityType: activityType,
          groupCode: groupCode,
          userId: userId,
        })
        that.getShareMessage()
      }
    }
  },
  getShareMessage(){
    const that = this;
    const userId = that.data.userId;
    const activityId = that.data.activityId;
    req.getShareMessage(userId, activityId).then(res => {
      if (res.status == 2000) {
        that.setData({
          user: res.data
        })
        that.getGroupList(0);
      }
    })
  },
  getGroupList: function (navTabIndex) {
    let that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    let activityId = "";
    wx.showLoading({
      title: '加载中',
    })
    req.getGroupBookingActivitys(token, phonetype, 6, 6, "", activityId, navTabIndex).then(res => {
      if (res.status == 2000) {
        let { siteList } = that.data;
        let addSiteList = {}
        for (var i = 0; i < res.data.length; i++) {
          addSiteList[i] = res.data[i];
        }
        that.setData({
          siteList: { ...siteList, ...addSiteList }
        })
        that.bindMemberIntroduce()
      } else if (res.status === 2013) {
        that.setData({ loginBgFlag: true })
      }
      wx.hideLoading()
    })
  },
  goSitePage: function (e) {
    wx.navigateTo({
      url: '../newStyleRoll/newStyleRoll?activityId=' + e.currentTarget.dataset.id + '&groupType=' + e.currentTarget.dataset.groupType
    })
  },
  bindMemberIntroduce() {
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.bindMemberIntroduce(token, phonetype, 6, that.data.groupCode).then(res => {
      if (res.status == 2000) {

      }
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../../pages/home/index',
      success: function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  // 登录信息
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
              let { encryptedData, iv } = res;
              wx.request({
                url: app.api.weChatAppletLogin,//自己的服务接口地址
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData,
                  iv,
                  code,
                },
                success: function (data) {
                  console.log(data)
                  if (data.data.status == 2000) {
                    let token = data.data.data.token;
                    let phonetype = data.data.data.phonetype;
                    let memberId = data.data.data.userInfo.id;
                    that.setData({
                      token,
                      phonetype,
                      memberId,
                      loginBgFlag: false
                    });
                    wx.setStorageSync('token', token);
                    wx.setStorageSync('phoneType', phonetype);
                    wx.setStorageSync('memberId', memberId);
                    app.globalData.isBind = data.data.data.isBind;
                    that.getShareMessage()
                  }
                }
              })
            }
          })
        }
      }
    });
  },
})