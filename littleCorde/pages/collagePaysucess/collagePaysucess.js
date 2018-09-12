const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
Page({
  data: {
    orderId:"",
    status:0,
    token:'',
    phonetype:'',
    numberGroupId:"",
    getGroupIsRookieGroup: {},
    endTime: "0:0:0",
    getGroupIsRookieGroupFlag: false,
    creatCardImg1: "",
    spuCanvas: true,
    windowHeight:0,
    activityId:"",
    flag:false,
    siteList:[]
},
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    wx.getImageInfo({
      src: "https://img3.cloudokids.cn/h5img/promotion/card111.jpg",
      success: function (res) {
        that.setData({
          creatCardImg1: res.path
        })
      }
    })
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName
        })
      }
    })
    var path = options.path;
    that.setData({
      orderId:path
    })
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    this.setData({
      token:token,
      phonetype: phonetype
    })
    req.getOrderIsSendCoupon(token,phonetype,6,that.data.orderId).then(res=>{
      if(res.status == 2000){
        this.setData({
          flag: res.data.outcome
        })
      }else{
        this.setData({
          flag: false
        })
      }
      this.getGroupIsRookieGroup()
    })
  },
  getGroupIsRookieGroup:function(){
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    console.info(that.data.orderId);
    setTimeout(function(){
      req.getGroupIsRookieGroup(token, phonetype, 6, "", that.data.orderId, 3, "").then(res => {
        console.info(res)
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
              activityType:res.data.type,
              getGroupIsRookieGroup: {
                endTime: that.time(res.data.endTime),
                flag: res.data.flag,
                number: res.data.number,
                status: res.data.status,
                members: arr,
                isBuy: res.data.isBuy,
                unpaid: res.data.unpaid,
                amount: res.data.amount
              }
            })
            that.getGroupList()
            if (that.data.activityType == 5){
              wx.request({
                url: app.api.showLmg,
                data: {
                  path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_5_2_" + that.data.numberGroupId,
                },
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  wx.downloadFile({
                    url: res.data,
                    success: function (data) {
                      that.setData({
                        canvasImg2: data.tempFilePath
                      })
                    }
                  })
                }
              })
            }
            if (that.data.activityType == 6){
              wx.request({
                url: app.api.showLmg,
                data: {
                  path: 'pages/newStyleRoll/newStyleRoll?activityId=' + that.data.activityId + "&groupType=6",
                },
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  wx.downloadFile({
                    url: res.data,
                    success: function (data) {
                      that.setData({
                        canvasImg2: data.tempFilePath
                      })
                    }
                  })
                }
              })
            }
          } else {
            that.setData({
              activityId: "",
              numberGroupId: "",
              getGroupIsRookieGroup: {},
              getGroupIsRookieGroupFlag: false
            })
          }
        }
      })
    },2000)
  },
  lookOrder:function(){
    var that = this;
    wx.navigateTo({
      url: '../collageDetail/collageDetail?orderId=' + that.data.orderId,
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
  onShareAppMessage:function(options){
    var that = this;
    app.tdsdk.customShare(options)
    if (that.data.activityType == 5){
      return {
        title: "好友" + that.data.nickName + "邀你享特权，14.9元即享原价49元的舒适无痕内裤",
        path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_5_2_" + that.data.numberGroupId,
        imageUrl: "https://img3.cloudokids.cn/h5img/promotion/card112.jpg",
        success: function (res) {

        },
      }
    }
    if (that.data.activityType == 6){
      return {
        title: that.data.creatCardText,
        imageUrl: that.data.creatCardImg2,
        path: 'pages/newStyleRoll/newStyleRoll?activityId=' + that.data.activityId + "&groupType=6",
        success: function (res) {

        },
      }
    }
  },
  bindItemTap: function () {
    var that = this;
    const timer = setInterval(function () {
      if (that.data.canvasImg2 == "") {

      } else {
        clearInterval(timer)
        const ctx = wx.createCanvasContext('spuCanvas');
        const grd = ctx.createLinearGradient(0, 0, 280, 400)
        that.setData({
          actionSheetHidden: true,
          spuCanvas: false,
          isScorll: "hidden"
        })
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#ffffff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, 280, 400)
        ctx.setFillStyle("black")
        if (that.data.activityType == 5) {
          ctx.drawImage(that.data.creatCardImg1, 0, 0, 280, 260)
        }
        if (that.data.activityType == 6) {
          ctx.drawImage(that.data.creatCardImg1, 130, 0, 280 * 1.5, 280 * 1.5, 0, 0, 280, 260)
        }
        ctx.drawImage(that.data.canvasImg2, 100, 275, 80, 80)
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 375)
        ctx.save()
        ctx.draw()
      }
    }, 500)
  },
  cancelSpuCanvasImg: function () {
    var that = this;
    that.setData({
      actionSheetHidden: true,
      spuCanvas: true,
      isScorll: "auto"
    })
  },
  saveSpuCanvasImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 280,
      height: 400,
      destWidth: 560,
      destHeight: 800,
      quality: "1",
      fileType: "png",
      canvasId: 'spuCanvas',
      success: function (res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                wx.showToast({
                  title: '保存成功',
                })
                that.setData({
                  actionSheetHidden: true,
                  spuCanvas: true,
                  isScorll: "auto"
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '保存失败',
                })
              }
            })
          },
          fail: function (res) {
            wx.showLoading({
              title: res,
            })
          }
        })
      }
    })
  },
  closeImg:function(){
    var that = this;
    that.setData({
      flag:false
    })
  },
  getGroupList: function () {
    let that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    let activityId = "";
    req.getGroupBookingActivitys(token, phonetype, 6, 6, "", activityId, 0).then(res => {
      if (res.status == 2000) {
        for (var i = 0; i < 1; i++) {
          that.data.siteList.push({
            activityDescription: res.data[i].activityDescription,
            activityTitle: res.data[i].activityTitle,
            memberCount: res.data[i].memberCount,
            img: res.data[i].img,
            beginTime: res.data[i].beginTime,
            id: res.data[i].id,
            groupBookingType: res.data[i].groupBookingType
          })
        }
        that.setData({
          siteList: that.data.siteList
        }) 
      }
    })
    req.getGroupBookingActivitys(token, phonetype, 6, that.data.activityType, "", activityId,"").then(res => {
      console.info(res, '343434')
      that.data.creatCardText = res.data[0].activityDescription || "";
      that.data.creatCardImg2 = res.data[0].img || "";
      if (that.data.activityType == 6) {
        wx.getImageInfo({
          src: res.data[0].img,
          success: function (res) {
            that.setData({
              creatCardImg1: res.path
            })
          }
        })
      }
      if (that.data.activityType == 5) {
        wx.getImageInfo({
          src: "https://img3.cloudokids.cn/h5img/promotion/card111.jpg",
          success: function (res) {
            that.setData({
              creatCardImg1: res.path
            })
          }
        })
      }
    })
  },
  goSitePage: function (e) {
    wx.switchTab({
      url: '../home/index',
    })
  },
  goSitePageImg: function (e) {
    wx.switchTab({
      url: '../home/index',
    })
  },
})