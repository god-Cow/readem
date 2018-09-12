const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
Page({
  data: {
    token: "",
    phoneType: "",
    orderId: "",
    orderInfo: {},
    flag:true,
    couponInfo:{},
    cardInfo:[],
    getGroupIsRookieGroup: {},
    getGroupIsRookieGroupFlag: false,
    activityId:"",
    spuCanvas: true,
    canvasImg2:"",
    groupCode:"",
    activityType:""
  },
  onLoad:function(options){
    var that = this;
    var orderId = options.orderId;
    that.setData({
      orderId: orderId
    })
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (result) {
            that.setData({
              phoneType: result.data
            })
            that.getMemberIsIntroducer()
            wx.request({
              url: app.api.jumpToPayResult,
              data: {
                orderSn: orderId
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function (data) {
                if (data.data.status == 2000) {
                  that.setData({
                    orderInfo: data.data.data
                  })
                }
              }
            })
            wx.request({
              url: app.api.markCard,
              data:{
                token:that.data.token,
                phonetype:that.data.phoneType,
                channel:"6",
                orderSn: orderId
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success:function(res){
                if(res.data.status == 2000){
                  that.setData({
                    flag:false,
                    couponInfo:res.data.data
                  })
                  for (var i = 0; i < res.data.data.cardInfo.length;i++){
                    that.data.cardInfo.push({
                      specialId: res.data.data.cardInfo[i].specialId,
                      value: res.data.data.cardInfo[i].value,
                      title: res.data.data.cardInfo[i].title,
                      type: res.data.data.cardInfo[i].type,
                      conditional: res.data.data.cardInfo[i].conditional,
                      description: res.data.data.cardInfo[i].description,
                      beginTimeStamp: res.data.data.cardInfo[i].beginTime,
                      categoryId: res.data.data.cardInfo[i].categoryId,
                      brandId: res.data.data.cardInfo[i].brandId,
                      valueVo: res.data.data.cardInfo[i].valueVo,
                      beginTime: that.timestampToTime(parseInt(res.data.data.cardInfo[i].beginTime)),
                      endTime: that.timestampToTime(parseInt(res.data.data.cardInfo[i].endTime)),
                    })
                  }
                  that.setData({
                    cardInfo: that.data.cardInfo
                  })
                }else{
                  that.setData({
                    flag: true
                  })
                }
              }
            })
          },
        })
      },
    })
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName
        })
      }
    })
  },
  goPlay:function(){
      wx.switchTab({
        url: '../../pages/home/index',
      })
  },
  order:function(){
    var that = this;
    var orderId = that.data.orderId
    wx.navigateTo({
      url: '../../pages/orderInfo/orderInfo?orderId=' + orderId
    })
  },
  goCoupon:function(){
    wx.navigateTo({
      url: '../discount/discount?currentTab=1',
    })
  },
  goSpecial:function(e){
    console.info(e);
    var timenow = Date.parse(new Date()) / 1000;
    if (timenow > e.currentTarget.dataset.begintimestamp){
      if (e.currentTarget.dataset.activityurlvo != null && e.currentTarget.dataset.activityurlvo != ""){
        if (e.currentTarget.dataset.activityurlvo.weixin != null && e.currentTarget.dataset.activityurlvo.weixin != "") {
          wx.navigateTo({
            url: e.currentTarget.dataset.activityurlvo.weixin,
          })
        } 
      } else {
        if (e.currentTarget.dataset.specialid != null && e.currentTarget.dataset.specialid != "" && e.currentTarget.dataset.specialid != "null") {
          wx.navigateTo({
            url: '../newStyle/newStyle?specialId=' + e.currentTarget.dataset.specialid + "&pageCome=1",
          })
        } else {
          if (e.currentTarget.dataset.brandid != null && e.currentTarget.dataset.brandid != "" && e.currentTarget.dataset.brandid != "null") {
            wx.navigateTo({
              url: '../newStyle/newStyle?specialId=' + e.currentTarget.dataset.brandid + "&pageCome=3",
            })
          } else {
            if (e.currentTarget.dataset.categoryid != null && e.currentTarget.dataset.categoryid != "" && e.currentTarget.dataset.categoryid != "null") {
              wx.navigateTo({
                url: '../newStyle/newStyle?specialId=' + e.currentTarget.dataset.categoryid + "&pageCome=2",
              })
            } else {
              wx.switchTab({
                url: '../home/index',
              })
            }
          }
        }
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '活动将于' + e.currentTarget.dataset.begintime +'请稍后在个人中心-我的优惠券进行关注！',
        showCancel:false
      })
    }
  },
  goBack:function(){
    wx.request({
      url: app.api.getActiveFlag,
      success: function (res) {
        if (res.data.status == 2000) {
          if (res.data.data.flag) {
            if (res.data.data.wchaturl != null && res.data.data.wchaturl != ""){
              wx.navigateTo({
                url: res.data.data.wchaturl,
              })
            }else{
              wx.switchTab({
                url: '../home/index',
              })
            }
          } else {
            wx.switchTab({
              url: '../home/index',
            })
          }
        }
      }
    })
  },
  timestampToTime: function (timestamp){
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate();
    return Y + M + D;
  },
  getGroupIsRookieGroup: function () {
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    console.info(that.data.orderId);
     setTimeout(function(){
       req.getGroupIsRookieGroup(token, phonetype, 6, "", that.data.orderId, 3, "").then(res => {
         console.info(res)
         if (res.status == 2000) {
           var activityId = res.data.activityId;
           var activityType = res.data.type;
           that.setData({
             activityType: activityType
           })
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
               activityId,
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
           } else {
             that.setData({
               activityId: "",
               numberGroupId: "",
               getGroupIsRookieGroup: {},
               getGroupIsRookieGroupFlag: false
             })
           }
           that.showImg()
         }
         that.creatCardTopImg();
       })
     },2000)
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
  onShareAppMessage: function (options) {
    var that = this;
    app.tdsdk.customShare(options)
    if (that.data.activityType == 5){
      return {
        title: "好友" + that.data.nickName + "邀你享特权，14.9元即享原价49元的舒适无痕内裤",
        imageUrl: "https://img3.cloudokids.cn/h5img/promotion/card112.jpg",
        path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_" + that.data.activityType + "_2_" + that.data.numberGroupId + "_" + " " + "_" + that.data.groupCode,
        success: function (res) {

        },
      }
    }
    if (that.data.activityType == 6){
      return {
        title: that.data.creatCardText,
        imageUrl: that.data.creatCardImg2,
        path: 'pages/newStyleRoll/newStyleRoll?activityId=' + that.data.activityId + "&groupType=6" + "&groupCode=" + that.data.groupCode,
        success: function (res) {

        },
      }
    }
  },
  creatCardTopImg() {
    var that = this;
    let activityId = that.data.activityId;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getGroupBookingActivitys(token, phonetype, 6, that.data.activityType, "", activityId,"").then(res => {
      console.info(res,'343434')
      that.data.creatCardText = res.data[0].activityDescription || "";
      that.data.creatCardImg2 = res.data[0].img || "";
      if(that.data.activityType == 6){
        wx.getImageInfo({
          src: res.data[0].img,
          success: function (res) {
            that.setData({
              creatCardImg1: res.path
            })
          }
        })
      }
      if (that.data.activityType==5){
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
  bindItemTap: function () {
    var that = this;
    const timer = setInterval(function () {
      if (that.data.canvasImg2 && that.data.creatCardImg1) {
        console.log(that.data.canvasImg2, that.data.creatCardImg1)
        clearInterval(timer)
        const ctx = wx.createCanvasContext('spuCanvas');
        const grd = ctx.createLinearGradient(0, 0, 280, 400)
        that.setData({
          actionSheetHidden: true,
          spuCanvas: false,
        })
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#ffffff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, 280, 400)
        if (that.data.activityType == 5){
          ctx.drawImage(that.data.creatCardImg1, 0, 0, 280, 280)
        }
        if (that.data.activityType == 6){
          ctx.drawImage(that.data.creatCardImg1, 130, 0, 280 * 1.5, 280 * 1.5, 0, 0, 280, 260)
        }
        ctx.drawImage(that.data.canvasImg2, 100, 290, 80, 80)
        ctx.setFontSize(14)
        ctx.setFillStyle("#3c3c3c")
        ctx.setTextBaseline('middle')
        ctx.setTextAlign('center')
        if (that.data.activityType == 6){
          ctx.fillText(that.data.creatCardText, 140, 275)
        }
        ctx.setFontSize(10)
        ctx.setFillStyle("#000")
        ctx.setTextBaseline('middle')
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 385)
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
  showImg(){
    const that = this;
    console.info(that.data.groupCode,"推手code")
    console.info(that.data.activityType,"类型")
    if (that.data.activityType == 6){
      wx.request({
        url: app.api.showLmg,
        data: {
          path: 'pages/newStyleRoll/newStyleRoll?activityId=' + that.data.activityId + "&groupType=6" + "&groupCode=" + that.data.groupCode,
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.info(res)
          wx.downloadFile({
            url: res.data,
            success: function (data) {
              that.setData({
                canvasImg2: data.tempFilePath
              })
              console.log(data.tempFilePath)
            }
          })
        }
      })
    }
    if (that.data.activityType == 5){
      wx.request({
        url: app.api.showLmg,
        data: {
          path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_" + that.data.activityType + "_2_" + that.data.numberGroupId + "_" + " " + "_" + that.data.groupCode,
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.info(res)
          wx.downloadFile({
            url: res.data,
            success: function (data) {
              that.setData({
                canvasImg2: data.tempFilePath
              })
              console.log(data.tempFilePath)
            }
          })
        }
      }) 
    }
  },
  getMemberIsIntroducer(){
    var that = this;
    req.getMemberIsIntroducer(that.data.token, that.data.phoneType, 6).then(res => {
      if (res.status == 2000) {
        if (res.data.outcome) {
          if (res.data.introducer.status == 2) {
            console.info(res)
            that.setData({
              groupCode: res.data.introducer.introduceCode
            })
            that.getGroupIsRookieGroup()
          } else {
            that.setData({
              groupCode: ""
            })
            that.getGroupIsRookieGroup()
          }
        } else {
          that.setData({
            groupCode: ""
          })
          that.getGroupIsRookieGroup()
        }
      }
    })
  }
})