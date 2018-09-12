var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
const pid = 5;
var getMoreGoods = function(that, pageNumber) {
  wx.request({
    url: app.api.getSpecialUrl,
    data: {
      version: 10000.,
      specialId: "2500",
      specialTopicId: "2577",
      pageNumber: pageNumber,
      pageSize: 20,
    },
    success: function(res) {
      if (res.data.status == 2000) {
        if (res.data.data == "null" || res.data.data == null) {
          that.setData({
            list: [],
            hiddenInfo: 'block',
            isAllHiddenInfo: 'none'
          });
        } else {
          var list = that.data.list;
          let newList = res.data.data.datas;
          var spuIdStr = [];
          var MemberspuIdStrs = that.data.MemberspuIdStrs;
          for (var i = 0; i < res.data.data.datas.length; i++) {
            spuIdStr.push(res.data.data.datas[i].spuId)
          }
          that.setData({
            pageNumber: that.data.pageNumber,
            spuIdStr: spuIdStr,
            list: [...list, ...newList],
            hidden: true,
            hiddenInfo: 'none',
            isAllHiddenInfo: 'none'
          })
          //会员
          var spuIdStrs = spuIdStr.join(",")
          let token = wx.getStorageSync("token");
          let phonetype = wx.getStorageSync("phoneType");
          wx.request({
            url: app.api.getMemberGoodsRateListByTopicAndSpu,
            data: {
              token: token,
              phonetype: phonetype,
              channel: 6,
              spuIdStr: spuIdStrs
            },
            success: function(res) {
              var val = {}
              if (res.data.status == 2000) {
                for (var i = 0; i < res.data.data.length; i++) {
                  var spuid = res.data.data[i].spuId;
                  val[spuid] = res.data.data[i];
                }
              }
              that.setData({
                MemberspuIdStrs: val
              })
            }
          })
          if (res.data.data.datas.length == 0 && that.data.list.length == 0) {
            that.setData({
              hiddenInfo: 'block',
              isAllHiddenInfo: 'none'
            });
          }
          if (res.data.data.datas.length == 0 && that.data.list.length != 0) {
            that.setData({
              hiddenInfo: 'none',
              isAllHiddenInfo: 'block',
            });
          }
        }
      }
    }
  })
}
Page({
  data: {
    pageNumber: 1,
    list: [],
    spuIdStr: [],
    MemberspuIdStrs: [],
    hiddenInfo: 'none',
    isAllHiddenInfo: 'none',
    groupList: [],
    loginBgFlag: false,
    navTabIndex: 1,
    getMemberIsRookieFlag: false,
    actionSheetHidden: true,
    spuCanvas: true,
    creatCardImg1:"",
    windowHeight: 0,
    groupCode:"",
    nickName:""
  },
  onLoad: function(options) {
    var that = this;
    wx.getImageInfo({
      src: "https://img3.cloudokids.cn/h5img/promotion/card111.jpg",
      success: function (res) {
        that.setData({
          creatCardImg1: res.path
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    that.getGroupBookingActivitys();
  },
  onShow() {
    var that = this;
    req.analyticsLog({
      event: 'view',
      pid: pid + '-' + that.data.navTabIndex
    })
  },
  getGroupBookingActivitys: function() {
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    if (token != null && token != "" && token != undefined) {
      req.getGroupBookingActivitys(token, phonetype, 6, 5, "", "","").then(res => {
        if (res.status == 2000) {
          that.setData({
            groupList: res.data
          })
          that.getMemberIsRookie()
          that.getMemberIsIntroducer()
          wx.getImageInfo({
            src: that.data.groupList[0].img,
            success: function (res) {
              that.setData({
                spuCanvasImage: res.path,
                spuCanvasWidth: res.width,
                spuCanvasHeight: res.height
              })
            }
          })
          wx.getUserInfo({
            success:function(res){
              that.setData({
                nickName:res.userInfo.nickName
              })
            }
          })
        }
        if (res.status == 2013) {
          that.getLogin()
        }
      })
    } else {
      that.setData({
        loginBgFlag: true
      })
    }
  },
  getLogin: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: function(r) {
              var code = r.code; //登录凭证
              if (code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function(res) {
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
  getUserInfoLogin: function(encryptedData, iv, code) {
    var that = this;
    wx.request({
      url: app.api.weChatAppletLogin, //自己的服务接口地址
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: code,
      },
      success: function(data) {
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
          that.getGroupBookingActivitys()
        }
      }
    })
  },
  bindGetUserInfo: function() {
    var that = this;
    wx.login({
      success: function(r) {
        var code = r.code; //登录凭证
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
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
  onReachBottom: function() {
    var that = this;
    if (that.data.collageTabStatus == 1) {
      var pageNumber = ++that.data.pageNumber;
      getMoreGoods(that, pageNumber)
    }
  },
  goDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  goDetailPage: function(e) {
    wx.navigateTo({
      url: '../detailPage/detailPage?path=' + e.currentTarget.dataset.id + "_" + e.currentTarget.dataset.type + "_1"
    })
  },
  navTabIndex: function(e) {
    const id = e.currentTarget.dataset.id;
    let that = this;
    if (id == that.data.navTabIndex) {

    } else {
      that.setData({
        navTabIndex: id,
      })
    }
    if (id == 2) {
      that.setData({
        pageNumber: 1,
        list: []
      })
      getMoreGoods(that, 1)
    }
    if (id == 1) {
      that.setData({
        hiddenInfo: 'none',
        isAllHiddenInfo: 'none',
      })
    }
    req.analyticsLog({
      event: 'view',
      pid: pid + '-' + that.data.navTabIndex
    })
  },
  getMemberIsRookie: function() {
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getNewOrOldMember(token, phonetype, app.globalData.channel).then(res => {
      if (res.status == 2000) {
        that.setData({
          getMemberIsRookieFlag: res.data
        })
      }
    })
  },
  goGetFree: function() {
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getSecret(token, phonetype, 6).then(res => {
      wx.navigateTo({
        url: '../getFree/getFree?path='+ res.data,
      })
    })
  },
  onShareAppMessage: function(options) {
    var that = this;
    app.tdsdk.customShare(options)
    req.analyticsLog({
      event: 'share',
      sid: 1,
      pid
    })
    return {
      title: "好友"+that.data.nickName+"邀你享特权，14.9元即享原价49元的舒适无痕内裤",
      path: 'pages/detailPage/detailPage?path=' + that.data.groupList[0].id + "_" + that.data.groupList[0].groupBookingType + "_2_" + " " + "_" + " " + "_" + that.data.groupCode,
      imageUrl: "https://img3.cloudokids.cn/h5img/promotion/card112.jpg",
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
        })
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#ffffff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, 280, 400)
        ctx.setFillStyle("black")
        ctx.drawImage(that.data.spuCanvasImage, 0, 0, that.data.spuCanvasWidth, that.data.spuCanvasHeight, 0, 0, 280, 215)
        ctx.drawImage(that.data.canvasImg2, 100, 280, 80, 80)
        ctx.setFontSize(10)
        ctx.setFontSize(14)
        ctx.setFillStyle('#000')
        ctx.setTextAlign('center')
        ctx.fillText(that.data.groupList[0].activityTitle, 140, 240)
        ctx.setFontSize(14)
        ctx.setFillStyle('#000')
        ctx.setTextAlign('center')
        ctx.fillText('拼团价' + that.data.groupList[0].activityPrice + '元 原价49元', 140, 265)
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
    req.analyticsLog({
      event: 'saca'
    })
  },
  shareList: function () {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/detailPage/detailPage?path=' + that.data.groupList[0].id + "_" + that.data.groupList[0].groupBookingType + "_2_" + " " + "_" + " " + "_" + that.data.groupCode,
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
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  getMemberIsIntroducer(){
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getMemberIsIntroducer(token, phonetype, 6).then(res => {
      if(res.data.outcome){
        if (res.data.introducer.status == 2){
          that.setData({
            groupCode: res.data.introducer.introduceCode
          })
        }else{
          that.setData({
            groupCode: ""
          })
        }
      }else{
        that.setData({
          groupCode: ""
        })
      }
    })
  },
  onPullDownRefresh() {
    this.onLoad();
    wx.stopPullDownRefresh();
  }
})