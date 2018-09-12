var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
Page({
  data: {
    loginBgFlag: false,
    groupList:[],
    nickname:"",
    actionSheetHidden: true,
    spuCanvas: true,
    creatCardImg1: "",
    windowHeight: 0,
    md5Id:"",
    freeInfo:{},
    groupCode:"",
  },
  onLoad:function(option){
    const that = this;
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
    that.setData({
      md5Id:option.path
    })
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType"); 
    that.loader()
  },
  loader(){
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType"); 
    let p1 = req.getMemberQualification(token, phonetype, 6);
    let p2 = req.getGroupBookingActivitys(token, phonetype, 6, 5, "", "","");
    let p3 = req.getMemberIsIntroducer(token, phonetype, 6);
    Promise.all([p1,p2,p3]).then(res => {
      console.info(res)
      if (res[0].status == 2000){
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              nickName: res.userInfo.nickName
            })
          }
        })
        var length = res[0].data.imgList.length;
        var arr = [];
        console.info(length)
        for (var i = 0; i < length; i++) {
          arr.push({
            avatar: res[0].data.imgList[i],
          })
        }
        if (length == 3) {

        } else {
          for (var a = 0; a < 3 -length; a++) {
            arr.push({
              avatar: "https://img3.cloudokids.cn/h5img/promotion/headImg.png",
            })
          }
        }
        console.info(res[2])
        if(res[2].data.outcome){
          if (res[2].data.introducer.status ==2){
            that.setData({
              groupCode: res[2].data.introducer.introduceCode
            })
          }else{
            that.setData({
              groupCode: ""
            })
          }
        }else{
          that.setData({
            groupCode:""
          })
        }
        that.setData({
          groupList: res[1].data,
          freeInfo:{
            flag:res[0].data.flag,
            count: res[0].data.count,
            imgList:arr
          }
        })
      }
      if (res[0].status == 2013){
        that.setData({
          loginBgFlag:true
        })
      }
    }).catch(result =>{
        console.info(result,"1111")
    })
  },
  getLogin: function () {
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
          that.loader()
        }
      }
    })
  },
  onShareAppMessage: function (options) {
    var that = this;
    app.tdsdk.customShare(options)
    return {
      title: "好友" + that.data.nickName + "邀你享特权，14.9元即享原价49元的舒适无痕内裤",
      path: 'pages/detailPage/detailPage?path=' + that.data.groupList[0].id + "_" + that.data.groupList[0].groupBookingType + "_2_" + " " + "_" + that.data.md5Id + "_" + that.data.groupCode,
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
        ctx.drawImage(that.data.creatCardImg1, 0, 0, 280, 240)
        ctx.drawImage(that.data.canvasImg2, 100, 260, 80, 80)
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 365)
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
  shareList: function () {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/detailPage/detailPage?path=' + that.data.groupList[0].id + "_" + that.data.groupList[0].groupBookingType + "_2_" + " " + "_" + that.data.md5Id + "_" + that.data.groupCode,
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
  getDHCard:function(){
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType"); 
    req.getDHCard(token,phonetype,6).then(res=>{
      wx.showToast({
        title: res.msg,
      })
      that.data.freeInfo.flag = false;
      that.setData({
        freeInfo: that.data.freeInfo
      })
      req.getMemberQualification(token, phonetype, 6).then(res=>{
        if (res.status == 2000) {
          var length = res.data.imgList.length;
          var arr = [];
          console.info(length)
          for (var i = 0; i < length; i++) {
            arr.push({
              avatar: res.data.imgList[i],
            })
          }
          if (length == 3) {

          } else {
            for (var a = 0; a < 3 - length; a++) {
              arr.push({
                avatar: "https://img3.cloudokids.cn/h5img/promotion/headImg.png",
              })
            }
          }
          that.setData({
            freeInfo: {
              flag: res.data.flag,
              count: res.data.count,
              imgList: arr
            }
          })
        }
      })
    })
    req.analyticsLog({
      event: 'clrc'
    });
  },
  bindGetUserInfo: function () {
    var that = this;
    wx.login({
      success: function (r) {
        var code = r.code; //登录凭证
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
})