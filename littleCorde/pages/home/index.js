const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 1; // 页面id
var thisPage = {}; // 全局this

Page({
  data: {
    navTabIndex: 0,
    clock: [],
    siteList: {},
    newPerson:false
  },
  navTabIndex: function (e) {
    const id = e.currentTarget.dataset.id;
    let that = this;
    if (id == that.data.navTabIndex) {

    } else {
      that.setData({
        navTabIndex: id,
        siteList: {}
      })
      that.getGroupList(that.data.navTabIndex)
      req.analyticsLog({
        event: 'view',
        pid: pid + '-' + that.data.navTabIndex
      })
    }
  },
  onLoad() {
    thisPage = this;
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getNewOrOldMember(token,phonetype,6).then(res=>{
      that.setData({
        newPerson:!res.data
      })
      that.getGroupList(that.data.navTabIndex);
    })
  },
  onReady(){
  },
  onShow() {
    var that = this;
    !wx.getStorageSync('token') ? this.setData({ loginBgFlag: true }) : this.setData({ loginBgFlag: false })
    req.analyticsLog({
      event: 'view',
      pid: pid + '-' + that.data.navTabIndex
    })
  },
  onUnload(){
    console.log('12')
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
          siteList: { ...siteList, ...addSiteList}
        })
        var arr = []
        for (var i = 0; i < that.data.siteList.length; i++) {
          arr.push(that.data.siteList[i].beginTime)
        }
        that.product(arr)
      } else if (res.status === 2013) {
        that.setData({ loginBgFlag: true })
      }
      wx.hideLoading()
    })
  },
  product: function (data) {
    var that = this;
    that.setData({
      xsqg: data
    })
    var interval = setInterval(function () {
      var clock = that.getData(that.data.xsqg);
      that.setData({
        clock: clock
      });
    }.bind(this), 1000);
  },
  getData: function (timetot) {
    var that = this;
    var timetot = timetot;
    var clockarr = [];
    var timenow = Date.parse(new Date()) / 1000;
    for (var i = 0; i < timetot.length; i++) {
      var totalSecond = timetot[i] - timenow;
      var totalstart = timetot[i] - timenow;
      var time = that.dateformat(totalSecond);
      clockarr.push(time);
    }
    return clockarr;
  },
  dateformat: function (micro_second) {
    var second = micro_second;//总的秒数
    if (second < 0) {
      return "0:0:0";
    } else {
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      var hr = Math.floor(second / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      var min = Math.floor(second / 60 % 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      var sec = Math.floor(second % 60);
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      return hrStr + ":" + minStr + ":" + secStr;
    }
  },
  goSitePage: function (e) {
    wx.navigateTo({
      url: '../newStyleRoll/newStyleRoll?activityId=' + e.currentTarget.dataset.id + '&groupType=' + e.currentTarget.dataset.groupType
    })
  },
  goSitePageImg: function (e) {
    var that = this;
    if (that.data.navTabIndex == 1) {
      wx.navigateTo({
        url: '../newStyleRoll/newStyleRoll?activityId=' + e.currentTarget.dataset.id + '&groupType=' + e.currentTarget.dataset.groupType
      })
    }
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
                    wx.setStorageSync("userData", data.data.data);
                    app.globalData.isBind = data.data.data.isBind;
                    that.setData({
                      siteList: []
                    })
                    that.getGroupList(that.data.navTabIndex);
                  }
                  // req.analyticsUser({
                  //   event: 'login',
                  //   pid
                  // });
                }
              })
            }
          })
        }
      }
    });
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  }
})

// 所有统计调用 非业务代码
// const allAnaly = {
//   preview: function () {
//     return getApp().analyApp.preview({
//       pid: pid + '-' + thisPage.data.navTabIndex
//     })
//   }
// } 
